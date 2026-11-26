"use client";

import { useInterface } from "@/app/components/site-frame";

import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, MessagesSquare, Mic } from "lucide-react";
import { activities, activityImages } from "@/lib/content";


const icons = { learn: BookOpen, topics: MessagesSquare, talk: Mic };

export default function Home() {
  const { t } = useInterface();

  return (
    <>
      <section className="intro">
        <h1>{t("headline")}</h1>
        <p>{t("intro")}</p>
        <p>{t("available")}</p>
      </section>
      <nav className="lesson-options" aria-label={t("learningNav")}>
        <Link className="button" href="/topics/">{t("topics")}</Link>
        <Link className="lesson-secondary" href="/learn/">{t("roleplay")}</Link>
        <Link className="lesson-secondary" href="/my-learning/">{t("learning")}</Link>
      </nav>
      <div className="cards">
        {activities.map((activity, index) => {
          const Icon = icons[activity];
          return (
            <article className={`card card-${activity}`} key={activity}>
              <div className="card-image">
                <Image src={publicPath(activityImages[activity])} alt="" fill sizes="(max-width: 680px) 100vw, 33vw" preload={index === 0} />
              </div>
              <div className="card-body">
                <span className="mode-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                <h2>{t(activity === "learn" ? "stepwise" : activity === "topics" ? "topics" : "free")}</h2>
                {activity !== "talk" && <p>{t(activity === "learn" ? "wordsToTalk" : "realTopics")}</p>}
                {activity === "talk"
                  ? <p>{t("developing")}</p>
                  : <Link className="button" href={`/${activity}`}>{t(activity === "learn" ? "start" : "explore")}</Link>}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
