import Link from "next/link";
import type { ReactNode } from "react";

export function PracticeCompletion({
  title, home, children, actions, footer,
}: { title: string; home: string; children: ReactNode; actions?: ReactNode; footer?: ReactNode }) {
  return (
    <section className="panel lesson-panel practice-panel">
      <h2 id="lesson-current-step" tabIndex={-1}>{title}</h2>
      {children}
      <div className="lesson-actions">
        <Link className="button" href="/">{home}</Link>
        {actions}
      </div>
      {footer}
    </section>
  );
}
