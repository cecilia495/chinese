"use client";

import Link from "next/link";
import { useInterface } from "@/app/components/site-frame";
import type { DiningLesson } from "@/lib/dining";
import { diningTranslation } from "@/lib/dining-translations";
import { DiningCourse } from "./dining-course";
import { LevelPicker } from "./level-picker";

export function LessonView({ lesson }: { lesson: DiningLesson }) {
  const { language, t } = useInterface();
  const title = language === "zh" ? lesson.title.zh : diningTranslation(lesson.title.en, language);
  const goal = language === "zh" ? lesson.goal.zh : diningTranslation(lesson.goal.en, language);

  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <p className="status"><bdi dir="ltr">HSK {lesson.level}</bdi> · {t("restaurant")}</p>
    <h1>{title}</h1>
    <p>{goal}</p>
    <LevelPicker active={lesson.level} />
    {lesson.level === "2" && <Link className="lesson-secondary" href="/learn/order/">{t("orderPractice")}</Link>}
    {lesson.level === "3" && <Link className="lesson-secondary" href="/learn/change-order/">{t("changeOrder")}</Link>}
    <DiningCourse lesson={lesson} locale="zh" viewerKey="guest" favorites={[]} canSave={false} aiAvailable={false} />
  </section>;
}
