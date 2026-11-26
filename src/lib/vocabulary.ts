import { diningAudio } from "./dining-audio";
import { getDiningLesson } from "./dining";

const translations: Record<string, readonly [string, string]> = {
  noodles: ["用面粉做成的长条形食物", "I’d like noodles."],
  rice: ["煮熟的大米", "I’d like rice."],
  tea: ["用茶叶泡成的饮品", "I’d like some tea."],
  fish: ["在水里生活的一类动物，也可指做成菜的鱼", "Is today’s fish good?"],
  choice: ["用于疑问句，表示在两个或多个选项中选择", "Would you like fish or noodles?"],
  menu: ["列出可点的菜品和饮品的单子", "Could I see the menu?"],
  bowl: ["盛食物的器皿，也可用来量其中的食物", "I’d like a bowl of noodles."],
  total: ["加在一起；总计", "How much is it in total?"],
};

export type VocabularyEntry = {
  key: string;
  level: "1" | "2" | "3";
  word: string;
  pinyin: string;
  definition: { en: string; zh: string };
  example: string;
  exampleEn: string;
  audio: string;
};

export function diningVocabulary(level: "1" | "2" | "3"): VocabularyEntry[] {
  const lesson = getDiningLesson(level);
  if (!lesson) return [];
  return lesson.words.map(({ id, text, pinyin, en, example }) => ({
    key: `dining:${level}:${id}`, level, word: text, pinyin, definition: { en, zh: translations[id][0] },
    example, exampleEn: translations[id][1], audio: diningAudio(level, id),
  }));
}

export function findVocabulary(key: unknown) {
  return (["1", "2", "3"] as const).flatMap(diningVocabulary).find((word) => word.key === key);
}
