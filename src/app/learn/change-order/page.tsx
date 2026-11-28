"use client";

import { useState } from "react";
import Link from "next/link";
import { useInterface } from "@/app/components/site-frame";
import { recordActivityCompletion } from "@/lib/activity-progress";
import { diningCopy } from "@/lib/dining-i18n";
import { changeOrderScript } from "@/lib/hsk3-change-order";
import { publicPath } from "@/lib/public-path";
import { LessonAudio, LessonRecorder } from "../lesson-audio";

const requests = [
  { text: "可以给我换成水吗？", feedback: "changeMissingReason" },
  { text: "这个饮料太甜了。", feedback: "changeMissingRequest" },
  { text: changeOrderScript.request.text, feedback: null },
] as const;

const corrections = ["对，换成茶。", changeOrderScript.correction.text] as const;

function source(clip: keyof typeof changeOrderScript) {
  return publicPath(`/audio/dining/hsk3-change/${clip}.mp3`);
}

export default function ChangeOrderPractice() {
  const { language, t } = useInterface();
  const labels = diningCopy[language];
  const [request, setRequest] = useState<number>();
  const [correction, setCorrection] = useState<number>();
  const selected = request === undefined ? undefined : requests[request];
  const requestAccepted = selected?.feedback === null;
  const confirmed = requestAccepted && correction === 1;

  return <section className="subpage lesson practice">
    <Link className="back" href="/learn/3/">{t("changeBack")}</Link>
    <h1>{t("changeOrder")}</h1>
    <Link className="lesson-secondary" href="/activities/">{t("activities")}</Link>
    <section className="panel lesson-question">
      <p>{t("changeGoal")}</p>
      <LessonAudio src={source("opening")} t={labels} />
      <div className="lesson-options" lang="zh-Hans" dir="ltr">
        {requests.map((entry, index) => <button className="lesson-secondary" type="button"
          key={entry.text} aria-pressed={index === request}
          data-answer={index === request && entry.feedback ? "incorrect" : undefined}
          onClick={() => { setRequest(index); setCorrection(undefined); }}>{entry.text}</button>)}
      </div>
      {selected?.feedback && <p role="status">{t(selected.feedback)}</p>}
      {requestAccepted && <LessonAudio src={source("request")} t={labels} example />}
    </section>
    {requestAccepted && <section className="panel lesson-question">
      <p>{t("changeCheck")}</p>
      <LessonAudio src={source("misunderstanding")} t={labels} />
      <div className="lesson-options" lang="zh-Hans" dir="ltr">
        {corrections.map((reply, index) => <button className="lesson-secondary" type="button"
          key={reply} aria-pressed={index === correction}
          data-answer={index === correction && index === 0 ? "incorrect" : undefined}
          onClick={() => {
            setCorrection(index);
            if (index === 1) recordActivityCompletion("change-order");
          }}>{reply}</button>)}
      </div>
      {correction === 0 && <p role="status">{t("changeWrongDrink")}</p>}
      {confirmed && <LessonAudio src={source("correction")} t={labels} example />}
    </section>}
    {confirmed && <section className="panel">
      <p role="status">{t("changeRecap")}</p>
      <p lang="zh-Hans" dir="ltr">{changeOrderScript.confirmation.text}</p>
      <LessonAudio src={source("confirmation")} t={labels} />
      <details className="lesson-listen-record">
        <summary>{labels.playExample}</summary>
        <p lang="zh-Hans" dir="ltr">{changeOrderScript.recap.text}</p>
        <LessonAudio src={source("recap")} t={labels} />
      </details>
      <LessonRecorder t={labels} />
    </section>}
  </section>;
}
