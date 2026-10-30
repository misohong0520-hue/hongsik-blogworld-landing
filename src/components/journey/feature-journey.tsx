import Image from "next/image";
import { ArrowDown, ArrowRight, Check, FileText, Search, Send, Video, Workflow } from "lucide-react";
import { JourneyMotion } from "./journey-motion";
import { FeatureVideoMotion } from "./feature-video-motion";
import { FeatureVideo } from "./feature-video";
import { SectionIntro } from "../overview/section-intro";
import styles from "./feature-journey.module.css";

const stages = [
  { id: "feature-dashboard", label: "글감·키워드 분석", short: "발견", x: 36, y: 320 },
  { id: "feature-writing", label: "AI 글쓰기", short: "작성", x: 190, y: 276 },
  { id: "feature-visual", label: "카드뉴스·숏폼", short: "확장", x: 316, y: 174 },
  { id: "feature-publishing", label: "발행·리포스트", short: "활용", x: 441, y: 59 },
  { id: "feature-automation", label: "자동 실행·색인", short: "관리", x: 568, y: 30 },
] as const;
const curves = [
  "M36 320 C110 320 140 300 190 276",
  "M190 276 C240 250 270 220 316 174",
  "M316 174 C360 124 391 80 441 59",
  "M441 59 C490 37 533 30 568 30",
];

function Curve() {
  return <svg className={styles.curve} viewBox="0 0 610 374" aria-hidden="true">
    {[95, 195, 295].map((y) => <path key={y} d={`M22 ${y} H590`} className={styles.gridline} />)}
    {curves.map((d, index) => <g key={d}><path d={d} className={styles.track} /><path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={0} data-curve-segment={index} className={styles.fill} /></g>)}
    {stages.map((stage, index) => <g key={stage.id} data-curve-node={index} className={styles.node}><circle cx={stage.x} cy={stage.y} r="10" /><text x={stage.x} y={stage.y + (index === 3 ? 37 : -25)} textAnchor={index === 0 ? "start" : index === 4 ? "end" : "middle"}>{stage.short}</text></g>)}
  </svg>;
}

function Result({ children }: { children: React.ReactNode }) {
  return <div className={styles.result}><ArrowRight size={18} aria-hidden="true" /><p>{children}</p></div>;
}

export function FeatureJourney() {
  return <section id="features" className={styles.section} aria-labelledby="journey-title">
    <JourneyMotion />
    <FeatureVideoMotion />
    <div className="landing-container">
      <div className={styles.intro}><SectionIntro id="journey-title" label="분석에서 바로 제작으로" title="분석한 그 자리에서," emphasis="콘텐츠 제작을 시작하세요." description="글감과 키워드를 고른 뒤, 글쓰기나 숏폼 제작으로 바로 이어가세요." closing="발견부터 제작·발행·관리까지, 아래 기능에서 확인하세요." /></div>
      <div className={styles.layout}>
        <aside data-journey-nav className={styles.sidebar} aria-label="주요 기능 탐색">
          <div className={styles.sidebarTop}><span className={styles.explore}>콘텐츠 운영의 연결</span><span className={styles.counter}><b data-journey-counter>01</b><span> / 05</span></span></div>
          <Curve />
          <nav className={styles.stageLinks} aria-label="기능별 상세 안내">{stages.map((stage, index) => <a key={stage.id} href={`#${stage.id}`} data-journey-link={index}><span className={styles.stageNumber}>{String(index + 1).padStart(2, "0")}</span><span>{stage.label}</span><ArrowDown size={16} aria-hidden="true" /></a>)}</nav>
          <p className={styles.sidebarNote}>주제를 찾고, 만들고, 넓혀 가세요.</p>
        </aside>
        <div className={styles.cards}>
          <article id="feature-dashboard" data-journey-card className={styles.card} aria-labelledby="dashboard-title">
            <div className={styles.cardHeading}><span className={styles.step}>01 · 대시보드</span><Search size={24} aria-hidden="true" /></div>
            <h3 id="dashboard-title"><span>오늘 쓸 주제를 찾았다면,</span><span>바로 제작으로 이어가세요.</span></h3>
            <p className={styles.lead}>무엇을 쓸지 고민하는 순간부터 함께합니다. 글감의 추천 이유를 살펴보고, 검색 수요와 연관 키워드를 비교해 주제를 골라보세요.</p>
            <figure className={styles.screenshot}><Image src="/images/dashboard-actual.png" width={1912} height={1033} alt="HongSik BlogWorld 대시보드의 글감 추천, 키워드 분석, 인기 키워드와 글쓰기 연결 화면" sizes="(max-width: 900px) 90vw, 660px" /><figcaption>실제 앱 화면 · AI 키워드 인사이트</figcaption></figure>
            <ul className={styles.points}><li><Check />추천 이유와 출처를 함께 보는 글감 추천</li><li><Check />검색 수요·연관 키워드 비교</li><li><Check />선택한 키워드로 글쓰기·숏폼 제작 화면 이동</li></ul>
            <Result>찾은 주제를 다시 옮겨 적는 수고를 줄이고, 제작을 시작하세요.</Result>
          </article>
          <article id="feature-writing" data-journey-card className={styles.card} aria-labelledby="writing-title">
            <span id="feature-sources" className={styles.anchorAlias} />
            <div className={styles.cardHeading}><span className={styles.step}>02 · AI 글쓰기</span><FileText size={24} aria-hidden="true" /></div>
            <h3 id="writing-title"><span>빈 화면 앞의 고민을,</span><span>검토할 수 있는 원고로.</span></h3>
            <p className={styles.lead}>키워드나 참고할 원문 URL에서 시작하세요. 준비한 자료와 글쓰기 설정을 바탕으로 제목과 본문을 만들고, 이미지를 확인해 발행할 글을 준비합니다.</p>
            <FeatureVideo name="writing" title="글쓰기 기능 시연" />
            <ul className={styles.points}><li><Check />제목 후보와 글쓰기 방식 선택</li><li><Check />준비한 자료를 활용한 AI 원고 작성</li><li><Check />제목·본문·이미지 검토 후 발행 단계 연결</li></ul>
            <Result>자료 준비 → AI 원고 작성 → 검토·발행. 한 흐름으로 이어집니다.</Result>
          </article>
          <article id="feature-visual" data-journey-card className={styles.card} aria-labelledby="visual-title">
            <div className={styles.cardHeading}><span className={styles.step}>03 · 카드뉴스·숏폼</span><Video size={24} aria-hidden="true" /></div>
            <h3 id="visual-title"><span>이야기를 전하는 방법을,</span><span>글 밖으로 넓혀보세요.</span></h3>
            <p className={styles.lead}>읽는 콘텐츠뿐 아니라 넘겨 보는 카드뉴스와 짧게 보는 숏폼도 제작하세요. 전달할 주제에 맞춰 콘텐츠 형식을 선택할 수 있습니다.</p>
            <FeatureVideo name="cardnews" title="카드뉴스 제작 시연" />
            <ul className={styles.points}><li><Check />주제에 맞는 카드뉴스 초안 제작</li><li><Check />문구와 디자인을 다듬는 편집</li><li><Check />대시보드 키워드에서 숏폼 제작으로 이동</li></ul>
            <Result>주제와 전달 목적에 맞는 형식으로 콘텐츠를 준비하세요.</Result>
          </article>
          <article id="feature-publishing" data-journey-card className={styles.card} aria-labelledby="publishing-title">
            <div className={styles.cardHeading}><span className={styles.step}>04 · 발행·리포스트</span><Send size={24} aria-hidden="true" /></div>
            <h3 id="publishing-title"><span>완성한 콘텐츠,</span><span>한 채널에서 끝내지 마세요.</span></h3>
            <p className={styles.lead}>블로그에 글을 발행하고, 이미 작성한 글은 리포스트로 다른 플랫폼에서도 활용하세요. 채널마다 같은 작업을 반복하는 부담을 줄여줍니다.</p>
            <FeatureVideo name="repost" title="리포스트 기능 시연" />
            <ul className={styles.points}><li><Check />발행 계정과 등록 방식 선택</li><li><Check />작성한 글을 다른 플랫폼에 맞춰 재구성</li><li><Check />발행 결과와 URL 확인</li></ul>
            <Result>처음부터 다시 쓰는 수고를 줄이고, 콘텐츠의 활용 범위를 넓히세요.</Result>
          </article>
          <article id="feature-automation" data-journey-card className={styles.card} aria-labelledby="automation-title">
            <span id="feature-indexing" className={styles.anchorAlias} />
            <div className={styles.cardHeading}><span className={styles.step}>05 · 자동 실행·색인</span><Workflow size={24} aria-hidden="true" /></div>
            <h3 id="automation-title"><span>반복하는 글쓰기와</span><span>발행 이후의 작업까지.</span></h3>
            <p className={styles.lead}>반복 운영에 필요한 자동 글쓰기 작업을 설정하고 진행 상황을 확인하세요. 발행한 글은 색인 요청 기능으로 검색엔진에 알리고 요청 결과를 관리할 수 있습니다.</p>
            <FeatureVideo name="indexing" title="색인 요청 시연" />
            <ul className={styles.points}><li><Check />반복할 글쓰기 작업 설정</li><li><Check />실행 단계와 처리 결과 확인</li><li><Check />발행한 글의 색인 요청·기록 관리</li></ul>
            <Result>콘텐츠를 만드는 일과 발행 후 관리까지, 필요한 기능을 골라 활용하세요.</Result>
          </article>
        </div>
      </div>
    </div>
  </section>;
}
