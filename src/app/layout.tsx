import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { dictionaries } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "中文伴 · Speak Chinese with AI",
  description: "Build confidence in Mandarin through everyday conversations.",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const t = dictionaries.zh;

  return (
    <html lang="zh-Hans">
      <body>
        <a className="skip-link" href="#main">{t.skip}</a>
        <header className="site-header">
          <div className="header-inner">
            <Link className="brand" href="/" aria-label={t.home}>
              <span className="seal" lang="zh-Hans" aria-hidden="true">伴</span>
              <span className="brand-text"><strong lang="zh-Hans">中文伴</strong><span>{t.footer}</span></span>
            </Link>
            <nav className="header-controls" aria-label={t.settings}>
              <Link className="pill" href="/settings/">学习设置</Link>
              <Link className="pill" href="/learn/" aria-label="选择 HSK 课程">
                HSK 1–3 <ChevronDown size={14} aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </header>
        <main id="main" className="main">{children}</main>
        <footer className="site-footer"><span>中文伴 · 访客体验</span></footer>
      </body>
    </html>
  );
}
