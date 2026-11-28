"use client";

import { useInterface } from "@/app/components/site-frame";

import Link from "next/link";
import { GuestLearning } from "./guest-learning";

export default function MyLearningPage() {
  const { t } = useInterface();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <h1>{t("learning")}</h1>
    <GuestLearning />
    <Link className="lesson-secondary" href="/activities/">{t("activities")}</Link>
  </section>;
}
