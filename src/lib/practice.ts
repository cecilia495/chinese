import type { Level } from "./learner";

export const feedbackModes = ["natural", "gentle", "key", "detailed"] as const;
export type FeedbackMode = (typeof feedbackModes)[number];
export const practiceKinds = ["topic", "chat", "call"] as const;
export type PracticeKind = (typeof practiceKinds)[number];
export const maxPracticeTurns = 24;
export const maxLearnerText = 600;
export const maxAudioBytes = 4 * 1024 * 1024;

export type PracticeTurn = {
  position: number;
  learner: string;
  reply: string;
  translation: string;
  hint: string;
  feedback: string;
  mode: FeedbackMode;
};

export type PracticeSession = {
  id: string;
  kind: PracticeKind;
  level: Level;
  mode: FeedbackMode;
  opening: string;
  voice: string | null;
  speechRate: number | null;
  summary: string | null;
  ended: boolean;
  revision: number;
  turns: PracticeTurn[];
};

export function isMode(value: unknown): value is FeedbackMode {
  return feedbackModes.some((mode) => mode === value);
}

export function isKind(value: unknown): value is PracticeKind {
  return practiceKinds.some((kind) => kind === value);
}

export function isSessionId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

export const speechRates = ["auto", "0.75", "0.85", "1.00", "1.10"] as const;
export type SpeechRate = (typeof speechRates)[number];
export const voiceChoices = ["default", "female", "male"] as const;
export type VoiceChoice = (typeof voiceChoices)[number];

export function isSpeechRate(value: unknown): value is SpeechRate {
  return speechRates.some((rate) => rate === value);
}

export function isVoiceChoice(value: unknown): value is VoiceChoice {
  return voiceChoices.some((voice) => voice === value);
}
