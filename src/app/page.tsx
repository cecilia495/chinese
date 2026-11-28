"use client";

import { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mic } from "lucide-react";
import { useInterface } from "@/app/components/site-frame";
import { courseSnapshot, recentCourse, subscribe, type CourseState } from "@/lib/dining-course-state";
import { saveGuestPreferences, useGuestPreferences } from "@/lib/guest-preferences";
import { publicPath } from "@/lib/public-path";
import { isSupportLanguage, supportLanguages } from "@/lib/support-languages";

function recentUnfinished() {
  const level = recentCourse();
  if (!["1", "2", "3"].includes(level)) return "";
  const state: CourseState = JSON.parse(courseSnapshot(`dining:v1:guest:${level}`));
  return state.step < 4 ? level : "";
}

export default function Home() {
  const { t } = useInterface();
  const preferences = useGuestPreferences();
  const resume = useSyncExternalStore(subscribe, recentUnfinished, () => "");
  const [level, setLevel] = useState(preferences.level);
  const [language, setLanguage] = useState(preferences.interfaceLanguage);

  return <section className="home-entry">
    <div className="intro">
      <h1>{t("headline")}</h1>
      <p>{t("intro")}</p>
      <p>{t("available")}</p>
      <Link className="button" href={`/learn/${resume || preferences.level}/`} onClick={() => {
        if (!preferences.onboardingComplete) saveGuestPreferences({ ...preferences, onboardingComplete: true });
      }}>
        <Mic size={20} aria-hidden="true" />{t(resume ? "resume" : "speak")}
      </Link>
      <nav className="lesson-options" aria-label={t("learningNav")}>
        <Link className="lesson-secondary" href="/topics/">{t("topics")}</Link>
        <Link className="lesson-secondary" href="/talk/">{t("free")} · {t("developing")}</Link>
        <Link className="lesson-secondary" href="/my-learning/">{t("learning")}</Link>
      </nav>
    </div>
    <Image className="home-entry-image" src={publicPath("/images/dining/dining-scene.webp")}
      alt="" width={768} height={432} preload />
    {!preferences.onboardingComplete && <details className="panel home-setup">
      <summary>{t("firstVisit")}</summary>
      <form onSubmit={(event) => {
        event.preventDefault();
        saveGuestPreferences({ ...preferences, interfaceLanguage: language, support: language,
          translation: language !== "zh", level, onboardingComplete: true });
      }}>
        <div className="topic-filters">
          <label>{t("interface")}
            <select value={language} onChange={(event) => {
              if (isSupportLanguage(event.target.value)) setLanguage(event.target.value);
            }}>
              {Object.entries(supportLanguages).map(([code, name]) =>
                <option key={code} value={code} lang={code}>{name}</option>)}
            </select>
          </label>
          <label>{t("level")}
            <select value={level} onChange={(event) => {
              const next = event.target.value;
              if (next === "1" || next === "2" || next === "3") setLevel(next);
            }}>
              <option value="1">HSK 1</option><option value="2">HSK 2</option><option value="3">HSK 3</option>
            </select>
          </label>
        </div>
        <div className="lesson-options">
          <button className="lesson-secondary" type="submit">{t("saveStart")}</button>
          <button className="lesson-secondary" type="button" onClick={() =>
            saveGuestPreferences({ ...preferences, onboardingComplete: true })}>{t("skipSetup")}</button>
        </div>
      </form>
    </details>}
  </section>;
}
