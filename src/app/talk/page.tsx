import Link from "next/link";
import { PartnerPresence } from "../practice/partner-presence";

export default function TalkPage() {
  return <section className="subpage lesson practice">
    <Link className="back" href="/">返回首页</Link>
    <h1>自由交流</h1>
    <section className="panel">
      <PartnerPresence locale="zh" activity="unavailable" />
      <p>此访客体验提供餐厅课程和引导式点餐。在线 AI 对话需要生产服务配置。</p>
      <Link className="button" href="/learn/">打开课程</Link>
    </section>
  </section>;
}
