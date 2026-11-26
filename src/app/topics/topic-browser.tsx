"use client";

import { useInterface } from "@/app/components/site-frame";
import { topicLabel } from "@/lib/topic-locales";
import Image from "next/image";
import { useState } from "react";
import { LevelPicker } from "../learn/level-picker";
import { publicPath } from "@/lib/public-path";
import { topicDomains } from "@/lib/topic-catalog";

export function TopicBrowser() {
  const { language, t } = useInterface();
  const [domain, setDomain] = useState("04");
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const term = query.trim().toLowerCase();
  const domains = topicDomains
    .filter((entry) => !domain || domain === entry.id)
    .map((entry) => ({
      ...entry,
      topics: entry.topics.filter((topic) =>
        (!level || topic.open) &&
        `${topic.name} ${topic.english} ${topicLabel(language, topic.id, topic.name)}`.toLowerCase().includes(term)),
    }))
    .filter((entry) => entry.topics.length > 0);

  return <>
    <div className="panel topic-filters">
      <label>{t("domains")}<select value={domain} onChange={(event) => setDomain(event.target.value)}>
        <option value="">{t("allDomains")}</option>
        {topicDomains.map((entry) => <option key={entry.id} value={entry.id}>{topicLabel(language, entry.id, entry.name)}</option>)}
      </select></label>
      <label>{t("search")}<input type="search" placeholder={t("searchExample")} value={query}
        onChange={(event) => { setQuery(event.target.value); setDomain(""); }} /></label>
      <label>{t("filter")}<select value={level} onChange={(event) => setLevel(event.target.value)}>
        <option value="">{t("allStatuses")}</option>
        {[1, 2, 3].map((value) => <option key={value} value={value}>HSK {value}</option>)}
      </select></label>
    </div>
    {domains.length === 0 && <p role="status">{t("noTopics")}</p>}
    {domains.map((entry) => <section key={entry.id} aria-labelledby={`domain-${entry.id}`}>
      <h2 id={`domain-${entry.id}`}>{topicLabel(language, entry.id, entry.name)}</h2>
      <div className="topic-results">
        {entry.topics.map((topic) => <article key={topic.id} className="panel">
          {topic.open && <Image className="topic-cover" src={publicPath("/images/dining/dining-scene.webp")}
            alt={t("diningImage")} width={380} height={214} />}
          <h3>{topicLabel(language, topic.id, topic.name)}</h3>
          {language === "zh" && <p lang="en">{topic.english}</p>}
          {topic.open ? <>
            <p>{t("diningSummary")}</p>
            <LevelPicker only={level} />
          </> : <p>{t("coming")}</p>}
        </article>)}
      </div>
    </section>)}
  </>;
}
