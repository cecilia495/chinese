"use client";

import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { saveLearning } from "@/lib/learning-client";
import { learningCopy } from "@/lib/learning-i18n";
import type { Locale } from "@/lib/i18n";

export function Favorite({ locale, wordKey, saved, commit }: {
  locale: Locale; wordKey: string; saved: boolean; commit: (value: boolean) => void;
}) {
  const t = learningCopy[locale];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function toggle() {
    setBusy(true);
    setError(false);
    try {
      await saveLearning({ action: "favorite", key: wordKey, saved: !saved });
      commit(!saved);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="lesson-secondary" disabled={busy} aria-pressed={saved} onClick={toggle}>
        {saved ? <BookmarkCheck size={17} aria-hidden="true" /> : <Bookmark size={17} aria-hidden="true" />}
        {busy ? t.waiting : saved ? t.remove : t.add}
      </button>
      {error && <p className="form-error" role="alert">{t.error}</p>}
    </>
  );
}
