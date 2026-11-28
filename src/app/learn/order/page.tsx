"use client";

import { useState } from "react";
import Link from "next/link";
import { useInterface } from "@/app/components/site-frame";
import { recordActivityCompletion } from "@/lib/activity-progress";
import { diningCopy } from "@/lib/dining-i18n";
import { orderScript, orders } from "@/lib/hsk2-order";
import { publicPath } from "@/lib/public-path";
import { LessonAudio, LessonRecorder } from "../lesson-audio";

function playSource(clip: keyof typeof orderScript) {
  return publicPath(`/audio/dining/hsk2-order/${clip}.mp3`);
}

export default function OrderPractice() {
  const { language, t } = useInterface();
  const labels = diningCopy[language];
  const [count, setCount] = useState<2 | 3>();
  const [priceAsked, setPriceAsked] = useState(false);
  const [chosenPrice, setChosenPrice] = useState<string>();
  const order = orders.find((entry) => entry.count === count);
  const verified = order && chosenPrice === order.price;

  function choose(next: 2 | 3) {
    setCount(next);
    setPriceAsked(false);
    setChosenPrice(undefined);
  }

  return <section className="subpage lesson practice">
    <Link className="back" href="/learn/2/">{t("orderBack")}</Link>
    <h1>{t("orderPractice")}</h1>
    <Link className="lesson-secondary" href="/activities/">{t("activities")}</Link>
    <section className="panel">
      <p>{t("orderChoose")}</p>
      <LessonAudio src={playSource("prompt")} t={labels} />
      <div className="lesson-options">
        {orders.map((entry) => <button className="lesson-secondary" key={entry.count}
          type="button" aria-pressed={entry.count === count} lang="zh-Hans" dir="ltr"
          onClick={() => choose(entry.count)}>{entry.label}</button>)}
      </div>
    </section>
    {order && <section className="panel">
      <p>{t("orderAsk")}</p>
      <button className="lesson-secondary" type="button" lang="zh-Hans" dir="ltr"
        onClick={() => setPriceAsked(true)}>{orderScript.ask.text}</button>
      {!priceAsked && <details className="lesson-listen-record">
        <summary>{labels.playExample}</summary>
        <LessonAudio src={playSource("ask")} t={labels} />
      </details>}
      {priceAsked && <div className="lesson-question">
        <LessonAudio key={order.count} src={playSource(`price-${order.count}`)} t={labels} />
        <p>{t("orderPrice")}</p>
        <div className="lesson-options">
          {orders.map(({ price }) => <button className="lesson-secondary" type="button" key={price}
            lang="zh-Hans" dir="ltr" aria-pressed={price === chosenPrice}
            data-answer={price === chosenPrice && price !== order.price ? "incorrect" : undefined}
            onClick={() => {
              setChosenPrice(price);
              if (price === order.price) recordActivityCompletion("order");
            }}>{price}</button>)}
        </div>
        {chosenPrice && <p role="status">{verified ? t("orderComplete") : labels.incorrect}</p>}
      </div>}
    </section>}
    {verified && <section className="panel">
      <p>{t("orderConfirm")}</p>
      <p lang="zh-Hans" dir="ltr">{orderScript[`confirm-${order.count}`].text}</p>
      <LessonAudio src={playSource(`confirm-${order.count}`)} t={labels} example />
      <LessonRecorder t={labels} />
    </section>}
  </section>;
}
