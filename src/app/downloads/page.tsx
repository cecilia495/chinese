"use client";

import { useInterface } from "@/app/components/site-frame";

import { publicPath } from "@/lib/public-path";
import Link from "next/link";

const archives = [
  ["zhongwenban-source.zip", "fullZip"],
  ["zhongwenban-code.zip", "codeZip"],
  ["zhongwenban-assets.zip", "assetsZip"],
] as const;

export default function Downloads() {
  const { t } = useInterface();
  return (
    <section className="subpage">
      <Link className="back" href="/">{t("back")}</Link>
      <h1>{t("downloads")}</h1>
      <div className="panel">
        <ul className="learning-list">
          {archives.map(([filename, label]) => (
            <li key={filename}>
              <a className="lesson-secondary" href={publicPath(`/downloads/${filename}`)} download>{t(label)}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
