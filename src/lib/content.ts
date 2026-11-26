export const activities = ["learn", "topics", "talk"] as const;
export type Activity = (typeof activities)[number];

export const activityImages: Record<Activity, string> = {
  learn: "/images/learn.webp",
  topics: "/images/topics.webp",
  talk: "/images/talk.webp",
};
