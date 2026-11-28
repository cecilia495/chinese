"use client";

import { useState } from "react";
import Link from "next/link";
import { useInterface } from "@/app/components/site-frame";
import { recordActivityCompletion } from "@/lib/activity-progress";
import { diningAudio } from "@/lib/dining-audio";
import { diningCopy } from "@/lib/dining-i18n";
import { foodDrinkRounds } from "@/lib/hsk1-food-drink";
import { publicPath } from "@/lib/public-path";
import { LessonAudio, LessonRecorder } from "../lesson-audio";

export default function FoodDrinkPractice() {
  const { language, t } = useInterface();
  const labels = diningCopy[language];
  const [roundIndex, setRoundIndex] = useState(0);
  const [choice, setChoice] = useState<number>();
  const [finished, setFinished] = useState(false);
  const round = foodDrinkRounds[roundIndex];
  const selected = choice === undefined ? undefined : round.choices[choice];

  function advance() {
    if (!selected?.matches) return;
    if (roundIndex === foodDrinkRounds.length - 1) {
      recordActivityCompletion("food-drink");
      setFinished(true);
      return;
    }
    setChoice(undefined);
    setRoundIndex(roundIndex + 1);
  }

  return <section className="subpage lesson practice">
    <Link className="back" href="/learn/1/">{t("foodDrinkBack")}</Link>
    <h1>{t("foodDrink")}</h1>
    <Link className="lesson-secondary" href="/activities/">{t("activities")}</Link>
    {finished ? <section className="panel">
      <p role="status">{t("foodDrinkDone")}</p>
      <LessonRecorder t={labels} />
      <button className="lesson-secondary" type="button" onClick={() => {
        setChoice(undefined);
        setRoundIndex(0);
        setFinished(false);
      }}>{t("activityRetry")}</button>
    </section> : <section className="panel lesson-question" key={round.id}>
      <p>{t("foodDrinkPrompt")}</p>
      <LessonAudio src={publicPath(`/audio/dining/hsk1-food-drink/${round.id}.mp3`)} t={labels} />
      <details className="lesson-listen-record">
        <summary>{labels.subtitle}</summary>
        <p lang="zh-Hans" dir="ltr">{round.prompt}</p>
      </details>
      <div className="lesson-options" lang="zh-Hans" dir="ltr">
        {round.choices.map((item, index) => <button className="lesson-secondary" type="button"
          key={item.text} aria-pressed={index === choice}
          data-answer={index === choice && !item.matches ? "incorrect" : undefined}
          onClick={() => setChoice(index)}>{item.text}</button>)}
      </div>
      {selected && <p role="status">{selected.matches ? labels.correct : t("foodDrinkRetry")}</p>}
      {selected?.matches && <LessonAudio src={diningAudio("1", round.example)} t={labels} example />}
      <button className="button" type="button" onClick={advance} disabled={!selected?.matches}>
        {roundIndex === foodDrinkRounds.length - 1 ? t("foodDrinkFinish") : labels.nextStep}
      </button>
    </section>}
  </section>;
}
