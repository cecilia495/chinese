import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiningLesson } from "@/lib/dining";
import { isLevel } from "@/lib/learner";
import { DiningCourse } from "../dining-course";
import { LevelPicker } from "../level-picker";

export function generateStaticParams() {
  return ["1", "2", "3"].map((level) => ({ level }));
}

export default async function LessonPage({ params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const lesson = isLevel(level) ? getDiningLesson(level) : undefined;
  if (!lesson) notFound();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">返回首页</Link>
    <p className="status">HSK {lesson.level} · 餐厅主题课程</p>
    <h1>{lesson.title.zh}</h1>
    <p>{lesson.goal.zh}</p>
    <LevelPicker active={level} />
    <DiningCourse lesson={lesson} locale="zh" viewerKey="guest" favorites={[]} canSave={false} aiAvailable={false} />
  </section>;
}
