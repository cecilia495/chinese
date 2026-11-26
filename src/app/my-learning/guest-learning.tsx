"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { getDiningLesson } from "@/lib/dining";
import { courseSnapshot, subscribe } from "../learn/dining-course";

const levels = ["1", "2", "3"] as const;

function snapshot() {
  return levels.map((level) => courseSnapshot(`dining:v1:guest:${level}`)).join("\n");
}

export function GuestLearning() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "");
  const records = value ? value.split("\n").map((entry) => JSON.parse(entry) as {
    step: number; completed: number[]; guided: number[]; finishedAttempts?: number;
  }) : [];
  return <article className="panel">
    <p>访客记录保存在当前浏览器标签页会话中，不会跨设备同步。</p>
    <ul>{levels.map((level, index) => {
      const lesson = getDiningLesson(level);
      const record = records[index];
      const finished = record?.finishedAttempts ?? (record?.step === 4 ? 1 : 0);
      return <li key={level}>
        <Link href={`/learn/${level}/`}>HSK {level} · {lesson?.title.zh}</Link>
        <p>已完成环节 {record?.completed.length ?? 0}/4 · 完成练习 {finished} 次</p>
        <p>{finished ? "已完成点餐情景任务" : "待完成点餐情景任务"}</p>
        <p>复习表达：{lesson?.repeat.map((phrase) => phrase.text).join("　")}</p>
      </li>;
    })}</ul>
  </article>;
}
