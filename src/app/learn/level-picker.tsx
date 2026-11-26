import Link from "next/link";
import { getDiningLesson } from "@/lib/dining";

export function LevelPicker({ active }: { active?: string }) {
  return (
    <nav className="lesson-options" aria-label="HSK 课程级别">
      {(["1", "2", "3"] as const).map((level) => (
        <Link className="lesson-secondary" aria-current={active === level ? "page" : undefined}
          key={level} href={`/learn/${level}/`}>HSK {level} · {getDiningLesson(level)?.title.zh}</Link>
      ))}
    </nav>
  );
}
