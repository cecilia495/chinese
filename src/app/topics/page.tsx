"use client";

import { useInterface } from "@/app/components/site-frame";

import Link from "next/link";
import { TopicBrowser } from "./topic-browser";

export default function TopicsPage() {
  const { t } = useInterface();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <h1>{t("topics")}</h1>
    <TopicBrowser />
  </section>;
}
