"""Extract official HSK vocabulary columns from the supplied outline (PyMuPDF)."""
import argparse
import csv
import re
from collections import Counter
from pathlib import Path

import fitz

FIELDS = [
    "word_id", "official_serial_number", "word", "pinyin", "original_level_label",
    "primary_level", "part_of_speech", "meaning", "meaning_source", "topic_ids",
    "communicative_functions", "grammar_tags", "common_collocations", "example_sentence",
    "example_pinyin", "translation_en", "translation_fr", "translation_ru",
    "translation_ar", "translation_es", "source_page", "pdf_page", "review_status",
]
# Column starts and printed-page offset for the supplied PDF.
BOUNDS = ((125, 220), (220, 305), (305, 420), (420, 550))
GRAMMAR = {"代": "指代", "介": "介词结构", "连": "连接", "助": "助词",
           "量": "数量表达", "副": "状语", "叹": "感叹", "后缀": "构词"}


def write_table(path, fields, rows):
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    rows, reviews, grammar, topics = [], [], [], []
    dining_targets = {17: "茶", 125: "米饭", 127: "面条儿", 352: "还是",
                      483: "鱼", 545: "菜单", 869: "碗", 923: "一共"}
    with fitz.open(args.pdf) as document:
        for page_number in range(80, 105):
            words = [w for w in document[page_number - 1].get_text("words") if w[3] - w[1] < 15]
            for x, top, _, bottom, serial, *_ in sorted(words, key=lambda w: w[1]):
                if not (90 <= x < 115 and 110 <= top < 740 and re.fullmatch(r"[0-9]+", serial)
                        and 1 <= int(serial) <= 1000):
                    continue
                number = int(serial)
                center = (top + bottom) / 2
                columns = [
                    " ".join(w[4] for w in sorted(words) if start <= w[0] < end
                             and abs((w[1] + w[3]) / 2 - center) < 4)
                    for start, end in BOUNDS
                ]
                level, word, pinyin, pos = columns
                primary = 1 if number <= 300 else 2 if number <= 500 else 3
                issues = []
                if not re.fullmatch(fr"{primary}(?:（[1-9](?:-[1-9])?）)*", level):
                    issues.append("原等级栏需核对")
                if not word or not pinyin or "\ufffd" in "".join(columns) or any(
                    0xE000 <= ord(c) <= 0xF8FF for c in "".join(columns)
                ) or re.search(r"[\u3400-\u9fff]", pinyin):
                    issues.append("字段缺失或疑似解析乱码")
                if "（" in level or re.search(r"[0-9]", word) or "、" in pos:
                    issues.append("跨级、编号义项或多词性需核对")
                tags = [tag for key, tag in GRAMMAR.items()
                        if key in re.split(r"[、（）]", pos)]
                key = f"hsk-{number:04d}"
                topic_id = "04-03" if number in dining_targets else ""
                if topic_id:
                    if word != dining_targets[number] and not word.startswith(dining_targets[number] + "（"):
                        raise ValueError(f"Check restaurant target {number}: {word}")
                    topics.append(dict(word_id=key, topic_id=topic_id, source="现有餐厅课程目标词"))
                rows.append(dict(word_id=key, official_serial_number=number, word=word,
                                 pinyin=pinyin, original_level_label=level, primary_level=primary,
                                 part_of_speech=pos, topic_ids=topic_id, grammar_tags="|".join(tags),
                                 source_page=page_number - 3, pdf_page=page_number,
                                 review_status="待核对；待释义；待翻译；话题待审" if issues
                                 else "机器提取；待释义；待翻译；话题待审"))
                reviews.extend(dict(word_id=key, word=word, reason=issue, pdf_page=page_number)
                               for issue in issues)
                grammar.extend(dict(word_id=key, tag=tag, source="大纲词性派生") for tag in tags)
    counts = Counter(row["official_serial_number"] for row in rows)
    missing = [n for n in range(1, 1001) if not counts[n]]
    duplicates = [n for n, count in counts.items() if count > 1]
    write_table(args.output / "hsk-missing.csv", ["official_serial_number"],
                [{"official_serial_number": n} for n in missing])
    if missing or duplicates:
        raise ValueError(f"Missing serials: {missing}; duplicate serials: {duplicates}")
    write_table(args.output / "hsk-vocabulary.csv", FIELDS, rows)
    write_table(args.output / "hsk-review.csv", ["word_id", "word", "reason", "pdf_page"], reviews)
    write_table(args.output / "hsk-grammar.csv", ["word_id", "tag", "source"], grammar)
    write_table(args.output / "hsk-topics.csv", ["word_id", "topic_id", "source"], topics)
    print(f"Extracted {len(rows)} rows; {len(reviews)} review flags; {len(grammar)} grammar links.")


if __name__ == "__main__":
    main()
