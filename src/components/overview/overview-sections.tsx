import {
  ArrowDown,
  ArrowRight,
  Check,
  Files,
  Layers3,
  LayoutDashboard,
  Link2,
  Monitor,
  Search,
  Send,
  Settings2,
  Sparkles,
  TimerReset,
  UserRound,
} from "lucide-react";
import styles from "./overview-sections.module.css";

const quickFeatures = [
  { title: "대시보드", detail: "글감·키워드 분석", href: "#feature-dashboard", icon: LayoutDashboard },
  { title: "AI 글쓰기", detail: "자료에서 원고로", href: "#feature-writing", icon: Sparkles },
  { title: "카드뉴스·숏폼", detail: "다양한 콘텐츠 제작", href: "#feature-visual", icon: Layers3 },
  { title: "발행·리포스트", detail: "채널에 맞게 활용", href: "#feature-publishing", icon: Send },
  { title: "자동 글쓰기", detail: "반복 작업 실행", href: "#feature-automation", icon: TimerReset },
  { title: "색인", detail: "검색엔진에 요청", href: "#feature-indexing", icon: Search },
] as const;

export function QuickFeaturesSection() {
  return (
    <section id="overview" className={styles.overview} aria-labelledby="overview-heading">
      <div className="landing-container">
        <div className={styles.overviewHeader}>
          <h2 id="overview-heading">블로그 운영에 필요한 기능을 한곳에.</h2>
          <a className={styles.textLink} href="#features">기능 자세히 보기 <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <nav aria-label="주요 기능 바로가기">
          <ul className={styles.quickFeatures}>
            {quickFeatures.map(({ title, detail, href, icon: Icon }) => (
              <li key={href}>
                <a href={href} className={styles.quickLink}>
                  <Icon size={24} strokeWidth={1.7} aria-hidden="true" />
                  <span className={styles.quickTitle}>{title}</span>
                  <span className={styles.quickDetail}>{detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

const problems = [
  {
    icon: Search,
    title: "오늘은 무엇을 써야 할지 고민하고",
    body: "눈에 띄는 주제를 찾은 뒤에도 검색 수요와 관련 키워드를 따로 살펴봐야 합니다.",
  },
  {
    icon: Files,
    title: "찾은 자료를 다시 정리하고 옮기고",
    body: "참고할 글과 선택한 주제를 모아, 콘텐츠 제작을 시작할 준비를 반복합니다.",
  },
  {
    icon: Layers3,
    title: "다른 채널을 위해 다시 작성하고",
    body: "블로그 글에 이어 카드뉴스와 숏폼을 만들고, 다른 플랫폼에 맞춰 콘텐츠를 손봅니다.",
  },
] as const;

export function OperatorProblemsSection() {
  return (
    <section id="audience" className={styles.problems} aria-labelledby="audience-heading">
      <div className={`landing-container ${styles.problemGrid}`}>
        <div className={styles.problemIntro}>
          <p className={styles.eyebrow}>콘텐츠 운영자의 익숙한 하루</p>
          <h2 id="audience-heading"><span>찾고, 쓰고, 다시 올리고.</span><span>오늘도 반복하고 있나요?</span></h2>
          <p className={styles.sectionDescription}>주제를 고르고 자료를 모은 뒤, 채널마다 다시 정리하는 일.<span className={styles.problemClosing}>흩어진 작업을 한 흐름으로 이어보세요.</span></p>
        </div>
        <ul className={styles.problemList}>
          {problems.map(({ icon: Icon, title, body }, index) => (
            <li key={title}>
              <span className={styles.problemIcon}><Icon size={22} strokeWidth={1.6} aria-hidden="true" /></span>
              <div><span className={styles.smallNumber}>0{index + 1}</span><h3>{title}</h3><p>{body}</p></div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const blogs = ["네이버 블로그", "WordPress", "블로그스팟", "티스토리"] as const;
const social = ["Instagram", "Threads"] as const;

export function PlatformsSection() {
  return (
    <section id="platforms" className={styles.platforms} aria-labelledby="platforms-heading">
      <div className="landing-container">
        <div className={styles.platformHeader}>
          <div><p className={styles.eyebrow}>내 채널에 맞는 콘텐츠 운영</p><h2 id="platforms-heading">발행할 곳도,<br />다시 활용할 곳도.</h2></div>
          <p className={styles.sectionDescription}>블로그에 글을 발행하고, 리포스트로 다른 채널에서도 활용하세요. 사용할 플랫폼과 기능에 맞춰 연결합니다.</p>
        </div>
        <div className={styles.channelGroups}>
          <div className={styles.channelGroup}>
            <div className={styles.channelLabel}><Send size={20} aria-hidden="true" /><h3>블로그 발행</h3></div>
            <ul className={styles.channelList}>{blogs.map((name) => <li key={name}>{name}</li>)}</ul>
          </div>
          <div className={styles.channelGroup}>
            <div className={styles.channelLabel}><Link2 size={20} aria-hidden="true" /><h3>리포스트로 확장</h3></div>
            <div className={styles.repostChannels}><span className={styles.repostCaption}>블로그 채널에 더해</span><ul className={styles.channelList}>{social.map((name) => <li key={name}>{name}</li>)}</ul></div>
          </div>
        </div>
        <p className={styles.platformNote}>플랫폼별 연결 설정과 지원 기능에 따라 사용할 수 있습니다.</p>
      </div>
    </section>
  );
}

const setup = [
  { icon: Monitor, title: "Windows 앱", detail: "PC에 앱을 설치해 사용합니다." },
  { icon: UserRound, title: "운영 계정 연결", detail: "발행할 채널의 계정을 준비합니다." },
  { icon: Settings2, title: "AI 연결 설정", detail: "사용할 AI와 글쓰기 설정을 확인합니다." },
] as const;

const process = [
  { title: "자료 준비", body: "키워드와 글감을 정하고, 참고할 원문 자료를 준비합니다.", href: "#feature-dashboard", action: "대시보드 살펴보기" },
  { title: "AI 원고 작성", body: "준비한 자료와 글쓰기 설정을 바탕으로 제목과 본문을 작성합니다.", href: "#feature-writing", action: "글쓰기 기능 보기" },
  { title: "검토·발행", body: "제목·본문·이미지와 발행 계정을 확인하고, 등록 결과를 살펴봅니다.", href: "#feature-publishing", action: "발행 기능 보기" },
] as const;

export function CompactProcessSection() {
  return (
    <>
      <section id="guide" className={styles.guide} aria-labelledby="guide-heading">
        <div className={`landing-container ${styles.guideGrid}`}>
          <div><p className={styles.eyebrow}>시작하기 전에</p><h2 id="guide-heading">내 운영 환경에 맞게<br />준비해 주세요.</h2><a className={styles.textLink} href="#contact">설정과 사용 문의 <ArrowRight size={17} aria-hidden="true" /></a></div>
          <ul className={styles.setupList}>
            {setup.map(({ icon: Icon, title, detail }) => <li key={title}><Icon size={23} strokeWidth={1.6} aria-hidden="true" /><div><h3>{title}</h3><p>{detail}</p></div><Check className={styles.setupCheck} size={18} aria-hidden="true" /></li>)}
          </ul>
        </div>
      </section>
      <section id="process" className={styles.process} aria-labelledby="process-heading">
        <div className="landing-container">
          <div className={styles.processHeader}><p className={styles.eyebrow}>블로그 글쓰기의 기본 흐름</p><h2 id="process-heading">준비하고, 작성하고,<br className={styles.mobileBreak} /> 확인한 뒤 발행하세요.</h2></div>
          <ol className={styles.processList}>
            {process.map((step, index) => <li key={step.title}><span className={styles.stepNumber}>0{index + 1}</span><h3>{step.title}</h3><p>{step.body}</p><a className={styles.textLink} href={step.href}>{step.action}<ArrowRight size={16} aria-hidden="true" /></a></li>)}
          </ol>
        </div>
      </section>
    </>
  );
}
