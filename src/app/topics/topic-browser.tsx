"use client";

import Image from "next/image";
import { useState } from "react";
import { LevelPicker } from "../learn/level-picker";
import { publicPath } from "@/lib/public-path";
import { topicDomains } from "@/lib/topic-catalog";

export function TopicBrowser() {
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
        `${topic.name} ${topic.english}`.toLowerCase().includes(term)),
    }))
    .filter((entry) => entry.topics.length > 0);

  return <>
    <div className="panel topic-filters">
      <label>主题领域<select value={domain} onChange={(event) => setDomain(event.target.value)}>
        <option value="">全部领域</option>
        {topicDomains.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
      </select></label>
      <label>搜索话题<input type="search" placeholder="例如：点餐、问路、购物" value={query}
        onChange={(event) => { setQuery(event.target.value); setDomain(""); }} /></label>
      <label>已开放等级<select value={level} onChange={(event) => setLevel(event.target.value)}>
        <option value="">全部状态</option>
        {[1, 2, 3].map((value) => <option key={value} value={value}>HSK {value}</option>)}
      </select></label>
    </div>
    {domains.length === 0 && <p role="status">没有符合条件的话题。</p>}
    {domains.map((entry) => <section key={entry.id} aria-labelledby={`domain-${entry.id}`}>
      <h2 id={`domain-${entry.id}`}>{entry.name}</h2>
      <div className="topic-results">
        {entry.topics.map((topic) => <article key={topic.id} className="panel">
          {topic.open && <Image className="topic-cover" src={publicPath("/images/dining/dining-scene.webp")}
            alt="餐厅点餐场景" width={380} height={214} />}
          <h3>{topic.name}</h3>
          <p lang="en">{topic.english}</p>
          {topic.open ? <>
            <p>HSK 1–3 · 从表达想吃什么，到确认点单需求。看图、听对话、跟读并完成点餐练习。</p>
            <LevelPicker only={level} />
          </> : <p>即将开放</p>}
        </article>)}
      </div>
    </section>)}
  </>;
}
