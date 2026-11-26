import { publicPath } from "@/lib/public-path";
import Link from "next/link";
import Image from "next/image";
import { LevelPicker } from "../learn/level-picker";

export default function TopicsPage() {
  return <section className="subpage lesson practice">
    <Link className="back" href="/">返回首页</Link>
    <h1>话题对话</h1>
    <article className="panel">
      <div className="topic-card">
        <Image src={publicPath("/images/dining/dining-scene.webp")} alt="" width={380} height={214} />
        <div><h2>饭店点餐</h2><p>在各等级课程的第四步可以体验引导式情景对话。</p></div>
      </div>
      <LevelPicker />
    </article>
  </section>;
}
