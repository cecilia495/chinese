import Link from "next/link";
import { LevelPicker } from "./level-picker";

export default function LearnPage() {
  return <section className="subpage lesson practice">
    <Link className="back" href="/">返回首页</Link>
    <h1>餐厅主题课程</h1>
    <LevelPicker />
  </section>;
}
