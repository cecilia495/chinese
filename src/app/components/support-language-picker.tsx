"use client";

import { saveGuestPreferences, useGuestPreferences } from "@/lib/guest-preferences";
import { isSupportLanguage, supportLanguages } from "@/lib/support-languages";

export function SupportLanguagePicker() {
  const preferences = useGuestPreferences();
  return <label className="support-language-picker">辅助解释语言
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
