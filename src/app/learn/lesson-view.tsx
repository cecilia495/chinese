"use client";

import Link from "next/link";
import { useInterface } from "@/app/components/site-frame";
import type { DiningLesson } from "@/lib/dining";
import { speakingActivities } from "@/lib/speaking-activities";
import { diningTranslation } from "@/lib/dining-translations";
import { DiningCourse } from "./dining-course";
import { LevelPicker } from "./level-picker";

export function LessonView({ lesson }: { lesson: DiningLesson }) {
  const { language, t } = useInterface();
  const activity = speakingActivities.find(({ level }) => String(level) === lesson.level);
  const title = language === "zh" ? lesson.title.zh : diningTranslation(lesson.title.en, language);
  const goal = language === "zh" ? lesson.goal.zh : diningTranslation(lesson.goal.en, language);

  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <p className="status"><bdi dir="ltr">HSK {lesson.level}</bdi> · {t("restaurant")}</p>
    <h1>{title}</h1>
    <p>{goal}</p>
    <LevelPicker active={lesson.level} />
    {activity && <Link className="lesson-secondary" href={activity.path}>{t(activity.title)}</Link>}
    <DiningCourse lesson={lesson} locale="zh" viewerKey="guest" favorites={[]} canSave={false} aiAvailable={false} />
  </section>;
}
