import { publicPath } from "@/lib/public-path";
import Link from "next/link";

const archives = [
  ["zhongwenban-source.zip", "完整源码与课程资源（108 个文件）"],
  ["zhongwenban-code.zip", "源码与配置（80 个文件）"],
  ["zhongwenban-assets.zip", "课程图片与音频（28 个文件）"],
];

export default function Downloads() {
  return (
    <section className="subpage">
      <Link className="back" href="/">返回首页</Link>
      <h1>下载中文伴源码</h1>
      <div className="panel">
        <ul className="learning-list">
          {archives.map(([filename, label]) => (
            <li key={filename}>
              <a className="lesson-secondary" href={publicPath(`/downloads/${filename}`)} download>{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
