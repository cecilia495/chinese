import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { practiceCopy } from "@/lib/practice-i18n";
import { partnerCopy } from "@/lib/partner-i18n";

export type PartnerActivity =
  "ready" | "unavailable" | "permission" | "listening" | "recognizing" | "thinking" | "buffering" | "speaking";

const states = {
  ready: "idle",
  unavailable: "idle",
  permission: "idle",
  listening: "listening",
  recognizing: "thinking",
  thinking: "thinking",
  buffering: "thinking",
  speaking: "speaking",
} satisfies Record<PartnerActivity, string>;

export function PartnerPresence({ locale, activity, pause }: {
  locale: Locale; activity: PartnerActivity; pause?: () => void;
}) {
  const t = partnerCopy[locale];
  return (
    <div className="partner-presence" data-state={states[activity]} data-activity={activity}>
      <Image className="partner-portrait" src={publicPath("/images/partner/mandarin-companion.webp")} alt="" width={84} height={84} unoptimized />
      <div className="partner-identity">
        <strong>{practiceCopy[locale].partner}</strong>
        <p className="partner-status" role="status" aria-atomic="true">
          <span className="partner-indicator" aria-hidden="true" />
          {t[activity]}
        </p>
      </div>
      {pause && <button className="lesson-secondary partner-pause" type="button" onClick={pause}>{t.pause}</button>}
    </div>
  );
}
