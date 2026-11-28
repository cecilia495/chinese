type Answer = number | null;
type Turn = { order: string; reply: string };
export type CourseState = {
  step: number;
  completionId?: string;
  finishedAttempts?: number;
  word: number;
  repeat: number;
  completed: number[];
  answers: Answer[];
  guided: number[];
  turns: Turn[];
};
const storageEvent = "dining-course-state";
export const initialState: CourseState = {
  step: 0, word: 0, repeat: 0, completed: [], answers: [], guided: [], turns: [],
};
const initialSnapshot = JSON.stringify(initialState);
const memory = new Map<string, string>();
const recentKey = "dining:v1:guest:recent";
let recentLevel = "";

export function recentCourse() {
  try {
    return sessionStorage.getItem(recentKey) ?? recentLevel;
  } catch {
    return recentLevel;
  }
}

export function subscribe(callback: () => void) {
  window.addEventListener(storageEvent, callback);
  return () => window.removeEventListener(storageEvent, callback);
}

export function serverSnapshot() {
  return initialSnapshot;
}

export function courseSnapshot(key: string) {
  try {
    return sessionStorage.getItem(key) ?? memory.get(key) ?? initialSnapshot;
  } catch {
    return memory.get(key) ?? initialSnapshot;
  }
}

export function saveCourse(key: string, state: CourseState) {
  const snapshot = JSON.stringify(state);
  memory.set(key, snapshot);
  const guestLevel = key.match(/^dining:v1:guest:([123])$/)?.[1];
  if (guestLevel) recentLevel = guestLevel;
  try {
    sessionStorage.setItem(key, snapshot);
    if (guestLevel) sessionStorage.setItem(recentKey, guestLevel);
  } catch {
    // The course remains usable in memory if storage is blocked.
  }
  window.dispatchEvent(new Event(storageEvent));
}
