import Link from "next/link";
import { GuestLearning } from "./guest-learning";

export default function MyLearningPage() {
  return <section className="subpage lesson practice">
    <Link className="back" href="/">返回首页</Link>
    <h1>我的学习</h1>
    <GuestLearning />
  </section>;
}
