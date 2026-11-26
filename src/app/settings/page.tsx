"use client";

import { useInterface } from "@/app/components/site-frame";

import Link from "next/link";
import { saveGuestPreferences, useGuestPreferences } from "@/lib/guest-preferences";
import { SupportLanguagePicker } from "@/app/components/support-language-picker";

export default function SettingsPage() {
  const { t } = useInterface();
  const preferences = useGuestPreferences();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">{t("back")}</Link>
    <h1>{t("settings")}</h1>
    <div className="panel topic-filters">
      <SupportLanguagePicker />
      <label>{t("level")}
        <select value={preferences.level} onChange={(event) => {
          const level = event.target.value;
          if (level === "1" || level === "2" || level === "3") saveGuestPreferences({ ...preferences, level });
        }}>
          <option value="1">HSK 1</option><option value="2">HSK 2</option><option value="3">HSK 3</option>
        </select>
      </label>
      <label className="lesson-check"><input type="checkbox" checked={preferences.pinyin}
        onChange={(event) => saveGuestPreferences({ ...preferences, pinyin: event.target.checked })} />{t("pinyin")}</label>
      <label className="lesson-check"><input type="checkbox" checked={preferences.translation} disabled={preferences.support === "zh"}
        onChange={(event) => saveGuestPreferences({ ...preferences, translation: event.target.checked })} />{t("translation")}</label>
    </div>
    <p>{t("preferenceNote")}</p>
    <Link className="button" href={`/learn/${preferences.level}/`}>{t("open")} · HSK {preferences.level}</Link>
  </section>;
}
