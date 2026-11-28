"use client";

import Link from "next/link";
import { useInterface } from "@/app/components/site-frame";
import { ActivityList } from "./activity-list";

export default function ActivitiesPage() {
  const { t } = useInterface();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <h1>{t("activities")}</h1>
    <p>{t("activitiesNote")}</p>
    <ActivityList />
    <p className="status">{t("sessionNote")}</p>
  </section>;
}
