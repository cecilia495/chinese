import type { Metadata } from "next";
import { SiteFrame } from "./components/site-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "中文伴 · Speak Chinese with AI",
  description: "Build confidence in Mandarin through everyday conversations.",
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hans"><body><SiteFrame>{children}</SiteFrame></body></html>;
}
