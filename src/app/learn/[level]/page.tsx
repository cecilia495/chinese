import { notFound } from "next/navigation";
import { getDiningLesson } from "@/lib/dining";
import { isLevel } from "@/lib/learner";
import { LessonView } from "../lesson-view";

export function generateStaticParams() {
  return ["1", "2", "3"].map((level) => ({ level }));
}

export default async function LessonPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const lesson = isLevel(level) ? getDiningLesson(level) : undefined;
  if (!lesson) notFound();
  return <LessonView lesson={lesson} />;
}
