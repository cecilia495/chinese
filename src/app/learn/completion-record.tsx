"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { learningCopy } from "@/lib/learning-i18n";
import { saveLearning } from "@/lib/learning-client";

export function CompletionRecord({ id, level, completed, locale }: {
  id: string; level: string; completed: number[]; locale: Locale;
}) {
  const t = learningCopy[locale];
  const [state, setState] = useState<"pending" | "saved" | "error">("pending");
  const [attempt, setAttempt] = useState(0);
  const steps = completed.join(",");

  useEffect(() => {
    let cancelled = false;
    void saveLearning({ action: "complete", id, level, steps: steps ? steps.split(",").map(Number) : [] })
      .then(() => { if (!cancelled) setState("saved"); })
      .catch(() => { if (!cancelled) setState("error"); });
    return () => { cancelled = true; };
  }, [id, level, steps, attempt]);

  if (state === "error") return (
    <div>
      <p className="form-error" role="alert">{t.error}</p>
      <button className="lesson-secondary" type="button" onClick={() => {
        setState("pending");
        setAttempt((current) => current + 1);
      }}>{t.saveCompletion}</button>
    </div>
  );
  return <p role="status" className="status">{state === "saved" ? t.saved : t.waiting}</p>;
}
