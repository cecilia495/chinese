import type { Level } from "./learner";

type Translation = { en: string; zh: string };
type Phrase = { id: string; text: string; pinyin: string; en: string };
type Word = Phrase & { outlineId: number; image: string; example: string };
type Question = { text: string; en: string; options: readonly string[]; correct: number };
type Line = { role: "server" | "customer"; text: string; en: string };
type ScenarioTurn = {
  prompt: string;
  en: string;
  options: readonly { text: string; reply: string; en: string }[];
};
export type DiningLesson = {
  level: "1" | "2" | "3";
  title: Translation;
  goal: Translation;
  words: readonly Word[];
  dialogue: readonly Line[];
  questions: readonly Question[];
  repeat: readonly Phrase[];
  scenario: readonly ScenarioTurn[];
};

const lessons: Record<DiningLesson["level"], DiningLesson> = {
  "1": {
    level: "1",
    title: { en: "Order food and tea", zh: "点主食和茶" },
    goal: { en: "Recognize familiar food and say what you’d like to eat and drink.", zh: "认出常见的食物，并说出自己想吃、想喝什么。" },
    words: [
      { id: "noodles", text: "面条儿", pinyin: "miàntiáor", en: "noodles", outlineId: 127, image: "vocab-noodles", example: "我想吃面条儿。" },
      { id: "rice", text: "米饭", pinyin: "mǐfàn", en: "cooked rice", outlineId: 125, image: "vocab-rice", example: "我要米饭。" },
      { id: "tea", text: "茶", pinyin: "chá", en: "tea", outlineId: 17, image: "vocab-tea", example: "我想喝茶。" },
    ],
    dialogue: [
      { role: "server", text: "你好！你想吃什么？", en: "Hello! What would you like to eat?" },
      { role: "customer", text: "我想吃面条儿。", en: "I’d like noodles." },
      { role: "server", text: "你想喝什么？", en: "What would you like to drink?" },
      { role: "customer", text: "我想喝茶。谢谢！", en: "I’d like tea. Thank you!" },
    ],
    questions: [
      { text: "客人想吃什么？", en: "What would the customer like to eat?", options: ["米饭", "面条儿", "面包"], correct: 1 },
      { text: "客人想喝什么？", en: "What would the customer like to drink?", options: ["水", "咖啡", "茶"], correct: 2 },
    ],
    repeat: [
      { id: "eat", text: "我想吃面条儿。", pinyin: "Wǒ xiǎng chī miàntiáor.", en: "I’d like noodles." },
      { id: "drink", text: "我想喝茶。", pinyin: "Wǒ xiǎng hē chá.", en: "I’d like tea." },
    ],
    scenario: [
      { prompt: "你好！你想吃什么？", en: "Hello! What would you like to eat?", options: [
        { text: "我想吃面条儿。", reply: "好，面条儿。", en: "Okay, noodles." },
        { text: "我要米饭。", reply: "好，米饭。", en: "Okay, rice." },
      ] },
      { prompt: "你想喝什么？", en: "What would you like to drink?", options: [
        { text: "我想喝茶。", reply: "好，给你茶。", en: "Okay, here’s your tea." },
        { text: "我想喝水。", reply: "好，给你水。", en: "Okay, here’s your water." },
      ] },
    ],
  },
  "2": {
    level: "2",
    title: { en: "Choose what to order", zh: "在饭店选菜" },
    goal: { en: "Ask about a dish, choose between two options and add a side.", zh: "询问一道菜的情况，在两个选项中作选择，并加点主食。" },
    words: [
      { id: "fish", text: "鱼", pinyin: "yú", en: "fish", outlineId: 483, image: "vocab-fish", example: "今天的鱼好吃吗？" },
      { id: "choice", text: "还是", pinyin: "háishi", en: "or (in a question)", outlineId: 352, image: "dining-scene", example: "你想吃鱼还是面条儿？" },
    ],
    dialogue: [
      { role: "customer", text: "你好，今天的鱼好吃吗？", en: "Hello, is today’s fish good?" },
      { role: "server", text: "很好吃。你想吃鱼还是面条儿？", en: "It’s very good. Would you like fish or noodles?" },
      { role: "customer", text: "我想吃鱼，还想吃米饭。", en: "I’d like fish, and I’d also like rice." },
      { role: "server", text: "好的，鱼和米饭。", en: "Okay, fish and rice." },
    ],
    questions: [
      { text: "客人问什么好不好吃？", en: "What dish does the customer ask about?", options: ["鱼", "米饭", "面条儿"], correct: 0 },
      { text: "客人还想吃什么？", en: "What else does the customer want to eat?", options: ["面包", "米饭", "菜"], correct: 1 },
    ],
    repeat: [
      { id: "choose", text: "你想吃鱼还是面条儿？", pinyin: "Nǐ xiǎng chī yú háishi miàntiáor?", en: "Would you like fish or noodles?" },
      { id: "add", text: "我想吃鱼，还想吃米饭。", pinyin: "Wǒ xiǎng chī yú, hái xiǎng chī mǐfàn.", en: "I’d like fish, and I’d also like rice." },
    ],
    scenario: [
      { prompt: "今天的鱼很好吃。你想吃鱼还是面条儿？", en: "Today’s fish is very good. Would you like fish or noodles?", options: [
        { text: "我想吃鱼。", reply: "好的，要鱼。", en: "Okay, fish." },
        { text: "我想吃面条儿。", reply: "好的，要面条儿。", en: "Okay, noodles." },
      ] },
      { prompt: "你还想要什么？", en: "What else would you like?", options: [
        { text: "我还想吃米饭。", reply: "好的，再来点儿米饭。", en: "Okay, some rice as well." },
        { text: "我还想喝茶。", reply: "好的，再来点儿茶。", en: "Okay, some tea as well." },
      ] },
    ],
  },
  "3": {
    level: "3",
    title: { en: "Order a meal and check the total", zh: "看菜单、确认总价" },
    goal: { en: "Use a menu to order food and a drink, then ask for the total.", zh: "根据菜单点主食和饮品，再询问总价。" },
    words: [
      { id: "menu", text: "菜单", pinyin: "càidān", en: "menu", outlineId: 545, image: "dining-scene", example: "请给我看一下菜单。" },
      { id: "bowl", text: "碗", pinyin: "wǎn", en: "bowl; a bowl of", outlineId: 869, image: "vocab-bowl", example: "我想要一碗面条儿。" },
      { id: "total", text: "一共", pinyin: "yígòng", en: "in total", outlineId: 923, image: "dining-scene", example: "一共多少钱？" },
    ],
    dialogue: [
      { role: "customer", text: "你好，请给我看一下菜单。", en: "Hello, could I see the menu?" },
      { role: "server", text: "好的。你想吃什么？", en: "Sure. What would you like to eat?" },
      { role: "customer", text: "我要一碗面条儿，还要一杯茶。一共多少钱？", en: "I’d like a bowl of noodles and a cup of tea. How much is it in total?" },
      { role: "server", text: "面条儿是十八元，茶是七元，一共二十五元。", en: "The noodles are 18 yuan and the tea is 7 yuan. It’s 25 yuan in total." },
    ],
    questions: [
      { text: "客人先要看什么？", en: "What does the customer ask to see first?", options: ["菜单", "饮料", "筷子"], correct: 0 },
      { text: "一共多少钱？", en: "How much does it all cost?", options: ["十八元", "七元", "二十五元"], correct: 2 },
    ],
    repeat: [
      { id: "order", text: "我要一碗面条儿，还要一杯茶。", pinyin: "Wǒ yào yì wǎn miàntiáor, hái yào yì bēi chá.", en: "I’d like a bowl of noodles and a cup of tea." },
      { id: "price", text: "一共多少钱？", pinyin: "Yígòng duōshao qián?", en: "How much is it in total?" },
    ],
    scenario: [
      { prompt: "你好，这是菜单。面条儿十八元，米饭五元。你想吃什么？", en: "Hello, here’s the menu. Noodles are 18 yuan and rice is 5 yuan. What would you like?", options: [
        { text: "我要一碗面条儿。", reply: "好的，一碗面条儿，十八元。", en: "Okay, a bowl of noodles, 18 yuan." },
        { text: "我要一碗米饭。", reply: "好的，一碗米饭，五元。", en: "Okay, a bowl of rice, 5 yuan." },
      ] },
      { prompt: "还要喝点儿什么吗？茶是七元。", en: "Would you like a drink as well? Tea is 7 yuan.", options: [
        { text: "再来一杯茶。一共多少钱？", reply: "好的，加一杯茶。", en: "Okay, I’ll add a cup of tea." },
        { text: "我不喝了。一共多少钱？", reply: "好的，不加饮料。", en: "Okay, no drink." },
      ] },
    ],
  },
};

export function getDiningLesson(level: Level): DiningLesson | undefined {
  return level === "1" || level === "2" || level === "3" ? lessons[level] : undefined;
}

export function scenarioTotal(food: number, drink: number) {
  const totals = [
    [{ text: "二十五", number: 25 }, { text: "十八", number: 18 }],
    [{ text: "十二", number: 12 }, { text: "五", number: 5 }],
  ];
  return totals[food]?.[drink];
}
