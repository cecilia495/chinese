"use client";

import { useInterface } from "@/app/components/site-frame";
import { diningTranslation } from "@/lib/dining-translations";
import Link from "next/link";
import { getDiningLesson } from "@/lib/dining";

export function LevelPicker({ active, only }: { active?: string; only?: string }) {
  const { language, t } = useInterface();
  return (
    <nav className="lesson-options" aria-label={t("choose")}>
      {(["1", "2", "3"] as const).filter((level) => !only || level === only).map((level) => {
        const title = getDiningLesson(level)?.title;
        return (
        <Link className="lesson-secondary" aria-current={active === level ? "page" : undefined}
          key={level} href={`/learn/${level}/`}><bdi dir="ltr">HSK {level}</bdi> · {title && (language === "zh" ? title.zh : diningTranslation(title.en, language))}</Link>
        );
      })}
    </nav>
  );
}
