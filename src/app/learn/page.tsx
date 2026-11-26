"use client";

import { useInterface } from "@/app/components/site-frame";

import Link from "next/link";
import { LevelPicker } from "./level-picker";

export default function LearnPage() {
  const { t } = useInterface();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <h1>{t("restaurant")}</h1>
    <LevelPicker />
  </section>;
}
