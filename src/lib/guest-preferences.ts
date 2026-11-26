"use client";

import { useSyncExternalStore } from "react";

const key = "zhongwenban:guest-preferences";
const defaults = { support: "zh", pinyin: true, translation: false, level: "1" } as const;
type Preferences = {
  support: "zh" | "en";
  pinyin: boolean;
  translation: boolean;
  level: "1" | "2" | "3";
};
const initial = JSON.stringify(defaults);
let temporary = initial;

function read() {
  try {
    return localStorage.getItem(key) ?? temporary;
  } catch {
    return temporary;
  }
}

function subscribe(listener: () => void) {
  window.addEventListener(key, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(key, listener);
    window.removeEventListener("storage", listener);
  };
}

export function useGuestPreferences(): Preferences {
  const snapshot = useSyncExternalStore(subscribe, read, () => initial);
  try {
    const value = JSON.parse(snapshot);
    return {
      support: value?.support === "en" ? "en" : "zh",
      pinyin: value?.pinyin !== false,
      translation: value?.translation === true,
      level: value?.level === "2" || value?.level === "3" ? value.level : "1",
    };
  } catch {
    return defaults;
  }
}

export function saveGuestPreferences(value: Preferences) {
  temporary = JSON.stringify(value);
  try {
    localStorage.setItem(key, temporary);
  } catch {
    // Changes still apply while this page session is active.
  }
  window.dispatchEvent(new Event(key));
}
