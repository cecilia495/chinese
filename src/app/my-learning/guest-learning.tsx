"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useGuestPreferences } from "@/lib/guest-preferences";
import { useInterface } from "@/app/components/site-frame";
import { diningTranslation } from "@/lib/dining-translations";
import { getDiningLesson } from "@/lib/dining";
import { courseSnapshot, subscribe } from "@/lib/dining-course-state";

const levels = ["1", "2", "3"] as const;

function snapshot() {
  return levels.map((level) => courseSnapshot(`dining:v1:guest:${level}`)).join("\n");
}

export function GuestLearning() {
  const { language, t } = useInterface();
  const { level: currentLevel } = useGuestPreferences();
  const value = useSyncExternalStore(subscribe, snapshot, () => "");
  const records = value ? value.split("\n").map((entry) => JSON.parse(entry) as {
    completed: number[]; finishedAttempts?: number;
  }) : [];
  return <article className="panel">
    <p>{t("level")} · <bdi dir="ltr">HSK {currentLevel}</bdi></p>
    <p>{t("sessionNote")}</p>
    <ul>{levels.map((level, index) => {
      const lesson = getDiningLesson(level);
      const record = records[index];
      const finished = record?.finishedAttempts ?? (record?.completed.includes(3) ? 1 : 0);
      return <li key={level}>
        <Link href={`/learn/${level}/`}><bdi dir="ltr">HSK {level}</bdi> · {lesson && (language === "zh" ? lesson.title.zh : diningTranslation(lesson.title.en, language))}</Link>
        <p>{t("steps")} <bdi dir="ltr">{record?.completed.length ?? 0}/4</bdi> · {t("attempts")} {finished}</p>
        <p>{t(finished ? "taskDone" : "taskPending")}</p>
        <p>{t("review")} · <bdi lang="zh-Hans" dir="ltr">{lesson?.repeat.map((phrase) => phrase.text).join("　")}</bdi></p>
      </li>;
    })}</ul>
  </article>;
}
