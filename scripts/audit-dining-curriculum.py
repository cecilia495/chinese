"""Validate curated restaurant scenarios against the original HSK PDF extraction."""
import argparse
import csv
import json
import subprocess
import sys
import tempfile
from collections import Counter
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parents[1]
SOURCE_FIELDS = (
    "official_serial_number", "word", "pinyin", "original_level_label",
    "part_of_speech", "source_page", "pdf_page",
)


def table(path):
    with path.open(encoding="utf-8-sig", newline="") as source:
        return list(csv.DictReader(source))


def audit(pdf):
    vocabulary = table(ROOT / "curriculum/hsk-vocabulary.csv")
    with tempfile.TemporaryDirectory() as temporary:
        subprocess.run([sys.executable, str(ROOT / "scripts/extract-hsk.py"), str(pdf), temporary], check=True)
        fresh = table(Path(temporary) / "hsk-vocabulary.csv")
    assert len(vocabulary) == len(fresh) == 1000, "Expected 1000 official entries"
    for number, (existing, extracted) in enumerate(zip(vocabulary, fresh), 1):
        assert int(existing["official_serial_number"]) == number, number
        assert all(existing[field] == extracted[field] for field in SOURCE_FIELDS), number
    counts = Counter(row["primary_level"] for row in vocabulary)
    assert counts == {"1": 300, "2": 200, "3": 500}, counts

    definition = json.loads((ROOT / "curriculum/dining-curriculum.json").read_text())
    by_number = {row["official_serial_number"]: row for row in vocabulary}
    all_words, targets = set(), set()
    with fitz.open(pdf) as document:
        for scenario in definition["scenarios"]:
            task = scenario["official_task"]
            assert [page - 3 for page in task["pdf_pages"]] == task["printed_pages"]
            assert any(task["title"] in document[p - 1].get_text() for p in task["pdf_pages"]), task
            for grammar in scenario.get("official_grammar", []):
                assert grammar["pdf_page"] - 3 == grammar["printed_page"]
                assert grammar["title"] in document[grammar["pdf_page"] - 1].get_text(), grammar
            for category in ("target_words", "support_words"):
                for number, word in scenario[category].items():
                    row = by_number[number]
                    assert row["word"] == word, (number, word, row["word"])
                    assert int(row["primary_level"]) <= scenario["level"], (number, scenario["id"])
                    all_words.add(number)
                    if category == "target_words":
                        targets.add(number)
    linked = {
        str(int(row["word_id"].split("-")[1]))
        for row in table(ROOT / "curriculum/hsk-topics.csv")
        if row["topic_id"] == definition["topic_id"]
    }
    assert targets == linked, "Restaurant targets differ from the released curriculum"
    print(f"Official entries: 1000/1000; restaurant targets: {len(targets)}.")
    print(f"Distinct words in this draft: {len(all_words)}; outside this draft: {1000 - len(all_words)}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    audit(parser.parse_args().pdf)
