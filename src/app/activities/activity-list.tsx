"use client";

import Link from "next/link";
import { useInterface } from "@/app/components/site-frame";
import { useActivityCompletion } from "@/lib/activity-progress";
import { speakingActivities } from "@/lib/speaking-activities";

function ActivityCard({ activity }: { activity: (typeof speakingActivities)[number] }) {
  const { t } = useInterface();
  const checked = useActivityCompletion(activity.id);
  return <article className="panel">
    <p className="status"><bdi dir="ltr">HSK {activity.level}</bdi></p>
    <h2>{t(activity.title)}</h2>
    <p>{t(activity.summary)}</p>
    {checked && <p className="status">{t("activityChecked")}</p>}
    <div className="lesson-options">
      <Link className="button" href={activity.path}>{t(checked ? "activityRetry" : "activityStart")}</Link>
      <Link className="lesson-secondary" href={`/learn/${activity.level}/`}>{t("activityLesson")}</Link>
    </div>
  </article>;
}

export function ActivityList() {
  return <div className="topic-results">
    {speakingActivities.map((activity) => <ActivityCard key={activity.id} activity={activity} />)}
  </div>;
}
