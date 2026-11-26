"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { saveGuestPreferences, useGuestPreferences } from "@/lib/guest-preferences";
import { interfaceText, type InterfaceLabel } from "@/lib/interface-text";
import { isSupportLanguage, supportLanguages } from "@/lib/support-languages";

export function useInterface() {
  const { interfaceLanguage: language } = useGuestPreferences();
  return { language, t: (label: InterfaceLabel) => interfaceText(language, label) };
}

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const preferences = useGuestPreferences();
  const { language, t } = useInterface();
  const lang = language === "zh" ? "zh-Hans" : language;
  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return <>
    <a className="skip-link" href="#main">{t("skip")}</a>
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label={t("home")}>
          <span className="seal" lang="zh-Hans" dir="ltr" aria-hidden="true">伴</span>
          <span className="brand-text"><strong lang="zh-Hans" dir="ltr">中文伴</strong></span>
        </Link>
        <nav className="header-controls" aria-label={t("learningNav")}>
          <select className="pill" aria-label={t("interface")} value={language} onChange={(event) => {
            const interfaceLanguage = event.target.value;
            if (isSupportLanguage(interfaceLanguage)) saveGuestPreferences({ ...preferences, interfaceLanguage });
          }}>
            {Object.entries(supportLanguages).map(([code, name]) =>
              <option key={code} value={code} lang={code} dir={code === "ar" ? "rtl" : "ltr"}>{name}</option>)}
          </select>
          <Link className="pill" href="/settings/">{t("settings")}</Link>
          <Link className="pill" href="/learn/" aria-label={t("choose")}>
            <bdi dir="ltr">HSK 1–3</bdi><ChevronDown size={14} aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </header>
    <main id="main" className="main">{children}</main>
    <footer className="site-footer"><span><bdi lang="zh-Hans" dir="ltr">中文伴</bdi> · {t("guest")}</span></footer>
  </>;
}
