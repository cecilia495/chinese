"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Play, Square } from "lucide-react";
import type { DiningCopy } from "@/lib/dining-i18n";

export function LessonAudio({ src, t, example = false }: { src: string; t: DiningCopy; example?: boolean }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [error, setError] = useState(false);

  async function play(rate: number) {
    const player = audio.current;
    if (!player) return;
    try {
      setError(false);
      player.currentTime = 0;
      player.playbackRate = rate;
      player.preservesPitch = true;
      await player.play();
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setError(true);
    }
  }

  return (
    <>
      <audio ref={audio} src={src} preload="none" onError={() => setError(true)} />
      <div className="lesson-actions">
        <button className="button" type="button" onClick={() => play(1)}><Play size={16} aria-hidden="true" />{example ? t.playExample : t.play}</button>
        <button className="lesson-secondary" type="button" onClick={() => play(.8)}>{t.slow}</button>
        <button className="lesson-secondary" type="button" onClick={() => audio.current?.pause()}>{t.stopAudio}</button>
      </div>
      {error && <p className="form-error" role="alert">{t.audioError}</p>}
    </>
  );
}

export type RecordingState = "idle" | "requesting" | "recording";

export function LessonRecorder({ t, onRecorded, onRecordingStart, onStateChange, extraAction }: {
  t: DiningCopy;
  onRecorded?: (recording: Blob) => void;
  onRecordingStart?: () => void;
  onStateChange?: (state: RecordingState) => void;
  extraAction?: React.ReactNode;
}) {
  const [state, setState] = useState<RecordingState>("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<string>();
  const active = useRef(false);
  const stream = useRef<MediaStream | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const objectUrl = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      clearTimeout(timer.current);
      const current = recorder.current;
      if (current?.state === "recording") current.stop();
      stream.current?.getTracks().forEach((track) => track.stop());
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    };
  }, []);

  function changeState(value: RecordingState) {
    setState(value);
    onStateChange?.(value);
  }

  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setError(t.recorderUnavailable);
      return;
    }
    setError("");
    changeState("requesting");
    onRecordingStart?.();
    try {
      const input = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!active.current) {
        input.getTracks().forEach((track) => track.stop());
        return;
      }
      stream.current = input;
      const current = new MediaRecorder(input);
      recorder.current = current;
      const chunks: Blob[] = [];
      let failed = false;
      current.ondataavailable = (event) => {
        if (event.data.size) chunks.push(event.data);
      };
      current.onerror = () => {
        failed = true;
        clearTimeout(timer.current);
        input.getTracks().forEach((track) => track.stop());
        if (active.current) {
          setError(t.recordError);
          changeState("idle");
        }
      };
      current.onstop = () => {
        clearTimeout(timer.current);
        input.getTracks().forEach((track) => track.stop());
        if (!active.current || failed) return;
        changeState("idle");
        if (!chunks.length) {
          setError(t.recordError);
          return;
        }
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        const recording = new Blob(chunks, { type: current.mimeType });
        objectUrl.current = URL.createObjectURL(recording);
        setResult(objectUrl.current);
        onRecorded?.(recording);
      };
      current.onstart = () => {
        if (!active.current) return;
        changeState("recording");
        timer.current = setTimeout(() => {
          if (current.state === "recording") current.stop();
        }, 30_000);
      };
      current.start();
      if (objectUrl.current) {
        URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = null;
      }
      setResult(undefined);
    } catch {
      stream.current?.getTracks().forEach((track) => track.stop());
      if (active.current) {
        setError(t.recordError);
        changeState("idle");
      }
    }
  }

  return (
    <div className="recorder">
      <p>{t.recordingPrivacy}</p>
      <div className="lesson-actions">
        {state === "recording" ? (
          <button className="button" type="button" onClick={() => {
            if (recorder.current?.state === "recording") recorder.current.stop();
          }}><Square size={15} aria-hidden="true" />{t.stop}</button>
        ) : (
          <button className="lesson-secondary" type="button" disabled={state === "requesting"} onClick={start}>
            <Mic size={16} aria-hidden="true" />{state === "requesting" ? t.requesting : t.record}
          </button>
        )}
        {state === "recording" && !onStateChange && <span role="status">{t.recording}</span>}
        {state === "idle" && extraAction}
      </div>
      {result && <audio controls src={result} aria-label={t.playback} />}
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}
