"use client";

import Link from "next/link";
import { saveGuestPreferences, useGuestPreferences } from "@/lib/guest-preferences";

import { isSupportLanguage, supportLanguages } from "@/lib/support-languages";

export default function SettingsPage() {
  const preferences = useGuestPreferences();
  return <section className="subpage lesson practice">
    <Link className="back" href="/">返回首页</Link>
    <h1>学习设置</h1>
    <div className="panel topic-filters">
      <label>辅助解释语言
        <select value={preferences.support} onChange={(event) => {
          const support = event.target.value;
          if (isSupportLanguage(support)) {
            saveGuestPreferences({ ...preferences, support, translation: support !== "zh" });
          }
        }}>
          {Object.entries(supportLanguages).map(([code, name]) =>
            <option key={code} value={code} lang={code} dir={code === "ar" ? "rtl" : "ltr"}>{name}</option>)}
        </select>
      </label>
      <label>当前 HSK 等级
        <select value={preferences.level} onChange={(event) => {
          const level = event.target.value;
          if (level === "1" || level === "2" || level === "3") saveGuestPreferences({ ...preferences, level });
        }}>
          <option value="1">HSK 1</option><option value="2">HSK 2</option><option value="3">HSK 3</option>
        </select>
      </label>
      <label className="lesson-check"><input type="checkbox" checked={preferences.pinyin}
        onChange={(event) => saveGuestPreferences({ ...preferences, pinyin: event.target.checked })} />显示拼音</label>
      <label className="lesson-check"><input type="checkbox" checked={preferences.translation} disabled={preferences.support === "zh"}
        onChange={(event) => saveGuestPreferences({ ...preferences, translation: event.target.checked })} />显示辅助语言译文</label>
    </div>
    <p>此设置用于餐厅课程的词义、例句和对话等教学内容。界面语言为中文，练习语言为普通话。偏好保存在此浏览器中，修改后立即生效。</p>
    <Link className="button" href={`/learn/${preferences.level}/`}>打开 HSK {preferences.level} 课程</Link>
  </section>;
}
