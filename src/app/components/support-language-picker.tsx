"use client";

import { useInterface } from "@/app/components/site-frame";

import { saveGuestPreferences, useGuestPreferences } from "@/lib/guest-preferences";
import { isSupportLanguage, supportLanguages } from "@/lib/support-languages";

export function SupportLanguagePicker() {
  const { t } = useInterface();
  const preferences = useGuestPreferences();
  return <label className="support-language-picker">{t("support")}
    <select value={preferences.support} onChange={(event) => {
      const support = event.target.value;
      if (!isSupportLanguage(support)) return;
      saveGuestPreferences({ ...preferences, support, translation: support !== "zh" });
    }}>
      {Object.entries(supportLanguages).map(([code, name]) =>
        <option key={code} value={code} lang={code} dir={code === "ar" ? "rtl" : "ltr"}>{name}</option>)}
    </select>
  </label>;
}
