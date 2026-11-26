import Link from "next/link";
import { TopicBrowser } from "./topic-browser";

export default function TopicsPage() {
  return <section className="subpage lesson practice">
    <Link className="back" href="/">返回首页</Link>
    <h1>主题学习</h1>
    <TopicBrowser />
  </section>;
}
