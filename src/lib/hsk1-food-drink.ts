export const foodDrinkRounds = [
  {
    id: "food",
    prompt: "你好！你想吃什么？",
    choices: [
      { text: "我想喝茶。", matches: false },
      { text: "我想吃面条儿。", matches: true },
    ],
    example: "eat",
  },
  {
    id: "drink",
    prompt: "你想喝什么？",
    choices: [
      { text: "我想喝茶。", matches: true },
      { text: "我想吃面条儿。", matches: false },
    ],
    example: "drink",
  },
] as const;
