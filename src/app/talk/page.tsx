"use client";

import { useInterface } from "@/app/components/site-frame";

import Link from "next/link";

export default function TalkPage() {
  const { t } = useInterface();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <h1>{t("free")}</h1>
    <section className="panel">
      <p>{t("talkStatus")}</p>
      <Link className="button" href="/learn/">{t("open")}</Link>
    </section>
  </section>;
}
