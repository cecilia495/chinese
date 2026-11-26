import { publicPath } from "@/lib/public-path";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, MessagesSquare, Mic } from "lucide-react";
import { activities, activityImages } from "@/lib/content";
import { dictionaries } from "@/lib/i18n";

const icons = { learn: BookOpen, topics: MessagesSquare, talk: Mic };

export default function Home() {
  const t = dictionaries.zh;

  return (
    <>
      <section className="intro">
        <h1>{t.headline}</h1>
        <p>{t.intro}</p>
        <p>HSK 1–3 · 餐厅点餐课程已开放</p>
      </section>
      <nav className="lesson-options" aria-label="学习入口">
        <Link className="button" href="/topics/">主题学习 <span lang="en">Learn by Topic</span></Link>
        <Link className="lesson-secondary" href="/learn/">情景口语 <span lang="en">Role-play</span></Link>
        <Link className="lesson-secondary" href="/my-learning/">我的学习 <span lang="en">My Learning</span></Link>
      </nav>
      <div className="cards">
        {activities.map((activity, index) => {
          const mode = t.modes[activity];
          const Icon = icons[activity];
          return (
            <article className={`card card-${activity}`} key={activity}>
              <div className="card-image">
                <Image src={publicPath(activityImages[activity])} alt="" fill sizes="(max-width: 680px) 100vw, 33vw" preload={index === 0} />
              </div>
              <div className="card-body">
                <span className="mode-icon"><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></span>
                <h2>{mode.title}</h2>
                <p>{mode.description}</p>
                {activity === "talk"
                  ? <p><span lang="en">Free Talk</span> · 开发中</p>
                  : <Link className="button" href={`/${activity}`}>{mode.action}</Link>}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
