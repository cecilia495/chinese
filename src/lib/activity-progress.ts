"use client";

import { useSyncExternalStore } from "react";
import type { SpeakingActivity } from "./speaking-activities";

const prefix = "zhongwenban:activity:";
const changed = "speaking-activity-progress";
const completed = new Set<SpeakingActivity>();

function subscribe(listener: () => void) {
  window.addEventListener(changed, listener);
  return () => window.removeEventListener(changed, listener);
}

function hasCompleted(id: SpeakingActivity) {
  if (completed.has(id)) return true;
  try {
    return sessionStorage.getItem(prefix + id) === "1";
  } catch {
    return false;
  }
}

export function useActivityCompletion(id: SpeakingActivity) {
  return useSyncExternalStore(subscribe, () => hasCompleted(id), () => false);
}

export function recordActivityCompletion(id: SpeakingActivity) {
  completed.add(id);
  try {
    sessionStorage.setItem(prefix + id, "1");
  } catch {
    // Progress remains available in memory when storage is blocked.
  }
  window.dispatchEvent(new Event(changed));
}
