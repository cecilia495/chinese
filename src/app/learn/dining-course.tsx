"use client";

import { publicPath } from "@/lib/public-path";


import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { scenarioTotal, type DiningLesson } from "@/lib/dining";
import { diningCopy } from "@/lib/dining-i18n";
import { dictionaries, type Locale } from "@/lib/i18n";
import { PracticeCompletion } from "@/app/components/practice-completion";
import { Favorite } from "@/app/vocabulary/favorite";
import { diningVocabulary } from "@/lib/vocabulary";
import { CompletionRecord } from "./completion-record";
import { LessonAudio, LessonRecorder } from "./lesson-audio";

type Answer = number | null;
type Turn = { order: string; reply: string };
type CourseState = {
  step: number;
  completionId?: string;
  word: number;
  repeat: number;
  completed: number[];
  answers: Answer[];
  guided: number[];
  turns: Turn[];
};
type Props = { lesson: DiningLesson; locale: Locale; viewerKey: string; aiAvailable: boolean; favorites: string[]; canSave: boolean };

const storageEvent = "dining-course-state";
const initialState: CourseState = {
  step: 0, word: 0, repeat: 0, completed: [], answers: [], guided: [], turns: [],
};
const initialSnapshot = JSON.stringify(initialState);
const memory = new Map<string, string>();

function subscribe(callback: () => void) {
  window.addEventListener(storageEvent, callback);
  return () => window.removeEventListener(storageEvent, callback);
}

function serverSnapshot() {
  return initialSnapshot;
}

function courseSnapshot(key: string) {
  try {
    return sessionStorage.getItem(key) ?? memory.get(key) ?? initialSnapshot;
  } catch {
    return memory.get(key) ?? initialSnapshot;
  }
}

function saveCourse(key: string, state: CourseState) {
  const snapshot = JSON.stringify(state);
  memory.set(key, snapshot);
  try {
    sessionStorage.setItem(key, snapshot);
  } catch {
    // The course remains usable in memory if storage is blocked.
  }
  window.dispatchEvent(new Event(storageEvent));
}

export function DiningCourse({ lesson, locale, viewerKey, aiAvailable, favorites, canSave }: Props) {
  const t = diningCopy[locale];
  const common = dictionaries[locale];
  const key = `dining:v1:${viewerKey}:${lesson.level}`;
  const snapshot = useSyncExternalStore(subscribe, () => courseSnapshot(key), serverSnapshot);
  const state: CourseState = JSON.parse(snapshot);
  const [savedKeys, setSavedKeys] = useState(favorites);
  const [subtitle, setSubtitle] = useState(false);
  const [translation, setTranslation] = useState(false);
  const [pinyin, setPinyin] = useState(true);
  const [ai, setAi] = useState<boolean>();
  const [sending, setSending] = useState(false);
  const [scenarioError, setScenarioError] = useState("");
  const [recorded, setRecorded] = useState(false);
  const [draft, setDraft] = useState("");
  const { step } = state;
  const word = lesson.words[state.word] ?? lesson.words[0];
  const entries = diningVocabulary(lesson.level);
  const vocabulary = entries[state.word] ?? entries[0];
  const phrase = lesson.repeat[state.repeat] ?? lesson.repeat[0];
  const showAi = aiAvailable && (ai ?? state.turns.length > 0);
  const stepReady = [
    true,
    lesson.questions.every((question, index) => state.answers[index] === question.correct),
    recorded || state.completed.includes(2),
    showAi ? state.turns.length === 2 : state.guided.length === lesson.scenario.length,
  ];

  function update(patch: Partial<CourseState>) {
    const current: CourseState = JSON.parse(courseSnapshot(key));
    saveCourse(key, { ...current, ...patch });
  }

  function go(next: number, complete = false) {
    const completed = complete && !state.completed.includes(step) ? [...state.completed, step] : state.completed;
    const completionId = canSave && next >= t.steps.length
      ? state.completionId ?? crypto.randomUUID()
      : state.completionId;
    update({ step: next, completed, completionId });
    requestAnimationFrame(() => document.getElementById("lesson-current-step")?.focus());
  }

  function resetStep() {
    if (step === 0) update({ word: 0 });
    if (step === 1) update({ answers: [] });
    if (step === 2) {
      setRecorded(false);
      update({ repeat: 0 });
    }
    if (step === 3) {
      setDraft("");
      setScenarioError("");
      update({ guided: [], turns: [] });
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const order = draft.trim();
    if (!order || sending) return;
    setSending(true);
    setScenarioError("");
    try {
      const response = await fetch("/api/learn/dining/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order, previous: state.turns[0] }),
      });
      if (!response.ok) {
        setScenarioError(response.status === 429 ? t.aiLimit : t.aiError);
        return;
      }
      const { reply } = await response.json() as { reply: string };
      update({ turns: [...state.turns, { order, reply }] });
      setDraft("");
    } catch {
      setScenarioError(t.aiError);
    } finally {
      setSending(false);
    }
  }

  const [resetKey, setResetKey] = useState(0);
  const guidedTotal = lesson.level === "3" && state.guided.length === 2
    ? scenarioTotal(state.guided[0], state.guided[1])
    : undefined;
  const audio = (id: string) => publicPath(`/audio/dining/${lesson.level}/${id}.mp3`);

  if (step >= t.steps.length) {
    return (
      <PracticeCompletion title={t.finished} home={common.back} footer={<p className="lesson-next-status">{t.noNext}</p>}
        actions={<>
          <Link className="lesson-secondary" href="/topics">{t.practiceTopic}</Link>
          <button className="lesson-secondary" type="button" onClick={() => {
            setRecorded(false);
            setAi(undefined);
            setDraft("");
            setScenarioError("");
            saveCourse(key, initialState);
            requestAnimationFrame(() => document.getElementById("lesson-current-step")?.focus());
          }}>{t.retry}</button>
        </>}>
        <p>{t.count} <strong>{state.completed.length} / {t.steps.length}</strong></p>
        {canSave && state.completionId
          ? <CompletionRecord id={state.completionId} level={lesson.level} completed={state.completed} locale={locale} />
          : <p className="status">{t.noProgressRecord}</p>}
      </PracticeCompletion>
    );
  }

  return (
    <>
      <ol className="lesson-steps">
        {t.steps.map((label, index) => (
          <li key={label} aria-current={step === index ? "step" : undefined}>
            <span className="lesson-step-number">{state.completed.includes(index) ? <Check size={15} aria-label={t.count} /> : index + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>

      <section className="panel lesson-panel" key={`${step}-${resetKey}`}>
        <h2 id="lesson-current-step" tabIndex={-1}>{t.steps[step]}</h2>
        {step === 0 && (
          <>
            <div className="lesson-options" lang="zh-Hans">
              {lesson.words.map((entry, index) => (
                <button className="lesson-secondary" type="button" key={entry.id} aria-pressed={index === state.word} onClick={() => update({ word: index })}>
                  {entry.text}
                </button>
              ))}
            </div>
            <div className="lesson-word">
              <Image src={publicPath(`/images/dining/${word.image}.webp`)} alt={word.text} lang="zh-Hans" width={500} height={300} />
              <div>
                <p className="lesson-phrase" lang="zh-Hans">{word.text}</p>
                {pinyin && <p lang="zh-Latn">{word.pinyin}</p>}
                <p>{vocabulary.definition[locale]}</p>
                <blockquote lang="zh-Hans">{word.example}</blockquote>
                {locale === "en" && <p>{vocabulary.exampleEn}</p>}
                {canSave && <Favorite key={vocabulary.key} locale={locale} wordKey={vocabulary.key}
                  saved={savedKeys.includes(vocabulary.key)} commit={(saved) => setSavedKeys((current) =>
                    saved ? [...current, vocabulary.key] : current.filter((key) => key !== vocabulary.key))} />}
              </div>
            </div>
            <LessonAudio key={word.id} src={audio(word.id)} t={t} example />
            <label className="lesson-check"><input type="checkbox" checked={pinyin} onChange={(event) => setPinyin(event.target.checked)} />{t.pinyin}</label>
          </>
        )}

        {step === 1 && (
          <>
            <p>{t.listenPrompt}</p>
            <LessonAudio src={audio("dialogue")} t={t} />
            <div className="lesson-options">
              <label className="lesson-check"><input type="checkbox" checked={subtitle} onChange={(event) => setSubtitle(event.target.checked)} />{t.subtitle}</label>
              {locale === "en" && <label className="lesson-check"><input type="checkbox" checked={translation} onChange={(event) => setTranslation(event.target.checked)} />{t.translation}</label>}
            </div>
            {(subtitle || (locale === "en" && translation)) && (
              <ul className="transcript">
                {lesson.dialogue.map((line) => (
                  <li key={line.text}>
                    <strong>{t[line.role]}</strong>
                    {subtitle && <span lang="zh-Hans">{line.text}</span>}
                    {locale === "en" && translation && <span>{line.en}</span>}
                  </li>
                ))}
              </ul>
            )}
            {lesson.questions.map((question, index) => (
              <div className="lesson-question" key={question.text}>
                <p lang="zh-Hans">{question.text}</p>
                {locale === "en" && translation && <p>{question.en}</p>}
                <div className="lesson-options" lang="zh-Hans">
                  {question.options.map((option, choice) => (
                    <button className="lesson-secondary" type="button" key={option}
                      aria-pressed={state.answers[index] === choice} onClick={() => {
                        const answers = [...state.answers];
                        answers[index] = choice;
                        update({ answers });
                      }}>{option}</button>
                  ))}
                </div>
                {state.answers[index] != null && <p role="status">{state.answers[index] === question.correct ? t.correct : t.incorrect}</p>}
              </div>
            ))}
            <details className="lesson-listen-record">
              <summary>{t.recordAnswer}</summary>
              <LessonRecorder t={t} />
            </details>
          </>
        )}

        {step === 2 && (
          <>
            <p>{t.followPrompt}</p>
            <div className="lesson-options">
              {lesson.repeat.map((entry, index) => (
                <button className="lesson-secondary" key={entry.id} type="button" aria-pressed={index === state.repeat}
                  onClick={() => update({ repeat: index })}>{index + 1}</button>
              ))}
            </div>
            <div className="lesson-phrase-box">
              <p className="lesson-phrase" lang="zh-Hans">{phrase.text}</p>
              {pinyin && <p lang="zh-Latn">{phrase.pinyin}</p>}
              {locale === "en" && translation && <p>{phrase.en}</p>}
            </div>
            <div className="lesson-options">
              <label className="lesson-check"><input type="checkbox" checked={pinyin} onChange={(event) => setPinyin(event.target.checked)} />{t.pinyin}</label>
              {locale === "en" && <label className="lesson-check"><input type="checkbox" checked={translation} onChange={(event) => setTranslation(event.target.checked)} />{t.translation}</label>}
            </div>
            <LessonAudio key={phrase.id} src={audio(phrase.id)} t={t} />
            <LessonRecorder key={`record-${phrase.id}`} t={t} onRecorded={() => setRecorded(true)} />
          </>
        )}

        {step === 3 && (
          <>
            {aiAvailable && (
              <div className="lesson-options">
                <button className="lesson-secondary" type="button" disabled={sending} aria-pressed={!showAi} onClick={() => setAi(false)}>{t.guided}</button>
                <button className="lesson-secondary" type="button" disabled={sending} aria-pressed={showAi} onClick={() => setAi(true)}>{t.ai}</button>
              </div>
            )}
            {!showAi && <p>{t.practicePrompt}</p>}
            {locale === "en" && (
              <label className="lesson-check">
                <input type="checkbox" checked={translation} onChange={(event) => setTranslation(event.target.checked)} />{t.translation}
              </label>
            )}
            {showAi ? (
              <>
                <p className="status">{t.aiDisclosure}</p>
                <ul className="transcript">
                  <li><strong>{t.server}</strong><span lang="zh-Hans">{lesson.scenario[0].prompt}</span>
                    {locale === "en" && translation && <span>{lesson.scenario[0].en}</span>}</li>
                  {state.turns.map((turn, index) => (
                    <li key={index}>
                      <strong>{t.customer}</strong><span lang="zh-Hans">{turn.order}</span>
                      <strong>{t.server}</strong><span lang="zh-Hans">{turn.reply}</span>
                    </li>
                  ))}
                </ul>
                {state.turns.length >= 2 ? <p role="status">{t.aiDone}</p> : (
                  <form className="preferences lesson-reply" method="post" onSubmit={sendReply}>
                    <label htmlFor="order">{t.aiReply}</label>
                    <input id="order" lang="zh-Hans" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={160} required />
                    <button className="button" type="submit" disabled={sending}>{sending ? t.sending : t.send}</button>
                  </form>
                )}
                {scenarioError && <p className="form-error" role="alert">{scenarioError}</p>}
              </>
            ) : (
              <div className="lesson-roleplay">
                {lesson.scenario.slice(0, state.guided.length + 1).map((turn, index) => {
                  const selected = turn.options[state.guided[index]];
                  return (
                    <div className="lesson-question" key={turn.prompt}>
                      <p><strong>{t.server}</strong> <span lang="zh-Hans">{turn.prompt}</span></p>
                      {locale === "en" && translation && <p>{turn.en}</p>}
                      {selected ? (
                        <>
                          <p><strong>{t.customer}</strong> <span lang="zh-Hans">{selected.text}</span></p>
                          <p><strong>{t.server}</strong> <span lang="zh-Hans">{selected.reply}</span></p>
                          {locale === "en" && translation && <p>{selected.en}</p>}
                        </>
                      ) : (
                        <div className="lesson-options" aria-label={t.response}>
                          {turn.options.map((option, choice) => (
                            <button className="lesson-secondary" type="button" lang="zh-Hans" key={option.text}
                              onClick={() => update({ guided: [...state.guided, choice] })}>{option.text}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {guidedTotal && <p><strong>{t.server}</strong> <span lang="zh-Hans">一共{guidedTotal.text}元。</span>
                  {locale === "en" && translation && <> · {guidedTotal.number} yuan in total.</>}</p>}
                {state.guided.length === lesson.scenario.length && <p role="status">{t.guidedDone}</p>}
              </div>
            )}
          </>
        )}
      </section>

      <div className="lesson-navigation">
        <button className="lesson-secondary" type="button" disabled={step === 0 || sending} onClick={() => go(step - 1)}>
          <ChevronLeft size={18} aria-hidden="true" />{t.backStep}
        </button>
        <button className="lesson-secondary" type="button" disabled={sending} onClick={() => {
          resetStep();
          setResetKey(resetKey + 1);
        }}>{t.retry}</button>
        <button className="lesson-secondary" type="button" disabled={sending} onClick={() => go(step + 1)}>{t.skip}</button>
        <button className="button" type="button" disabled={!stepReady[step] || sending} onClick={() => go(step + 1, true)}>
          {step === 3 ? t.finish : t.nextStep}<ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
