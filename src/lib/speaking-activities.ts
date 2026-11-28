import type { InterfaceLabel } from "./interface-text";

export const speakingActivities = [
  { id: "food-drink", level: 1, title: "foodDrink", summary: "foodDrinkSummary", path: "/learn/food-drink/" },
  { id: "order", level: 2, title: "orderPractice", summary: "activityOrder", path: "/learn/order/" },
  { id: "change-order", level: 3, title: "changeOrder", summary: "activityChange", path: "/learn/change-order/" },
] as const satisfies readonly { id: string; level: number; title: InterfaceLabel; summary: InterfaceLabel; path: string }[];

export type SpeakingActivity = (typeof speakingActivities)[number]["id"];
