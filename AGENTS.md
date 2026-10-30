# HongSik BlogWorld landing page

작업 전 `C:/Users/misoh/.codex/codex.md`를 읽는다. 사용자의 현재 명시적 요청과 프로젝트의 구체적 지침을 우선한다.

## 목적과 범위

- Codeit 미션 5에 맞춰 HongSik BlogWorld 앱을 소개하는 한국어 랜딩페이지를 만든다.
- 타깃: 자료 준비·AI 글 작성·발행을 반복하는 개인 운영자와 소규모 사업자, 상위 노출을 목표로 키워드 선정을 자동화하고 싶은 운영자.
- 브랜드: 사용자 제공 초록 H, 이름 `HongSik BlogWorld`.
- 문의 `support@hongsik.blog`, 배포 주소 `https://blogworld.hongsik.blog`.
- 실제 근거 없는 상위 노출·수익·시간 절감 수치, 고객 후기·기업 로고를 넣지 않는다.
- 기존 데스크톱 앱의 코드·프롬프트·계정·DB와 WordPress는 수정 대상이 아니다.
- 로그인·결제·실제 AI 호출·메일 전송 서버는 현재 범위가 아니다.

## 기술과 구조

- Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui를 사용한다.
- 화면은 `.tsx`, 데이터·설정·공통 로직은 `.ts`로 구분한다.
- `src/app/layout.tsx`: 공통 문서·메타정보. `src/app/page.tsx`: 섹션 조합.
- `src/components/<영역>/`: 실제 섹션, `src/components/ui/`: 공통 UI.
- `src/lib/site.ts`: 이름·문의·도메인 등 공개 설정. 비밀값을 넣지 않는다.

## 디자인과 단계

- 사용자 승인으로 곡선 오른쪽 02~05의 안내 그래픽을 제공된 글쓰기·카드뉴스·리포스트·색인 MP4로 교체했다. 썸네일·별도 재생 CTA는 추가하지 않는다. 영상이 화면 중앙에 들어온 뒤 180ms 머무르면 무음으로 한 개만 반복 재생하고, 벗어나거나 다음 영상이 중앙에 오면 정지한다. 탭 숨김·수동 일시정지·동작 줄이기를 존중한다. 원본 860×484 비율과 기본 일시정지·전체화면 조작을 유지한다. 03 영상은 카드뉴스, 05 영상은 색인만 보여주는 것으로 표시한다. 원본 URL과 검증은 `docs/scroll-feature-videos.md`를 따른다.
- 첫 화면은 사용자 승인 문구 ‘글감 고민은 줄이고, / 콘텐츠는 더 다양하게.’를 두 줄로 표시한다. 본문은 세 문장으로 분리하고 짧고 얇은 민트 밑줄을 사용한다. CTA는 ‘주요 기능 살펴보기’ 하나로 `#features`에 연결한다. ‘이메일로 문의하기’ 보조 링크는 최신 요청으로 제거했다. 사용자 승인으로 메인 버튼에 200ms의 2px 상승·화살표 3px 하강 효과를 적용했다. 마우스와 키보드 포커스에 반응하며 터치의 잔류 hover와 동작 줄이기 설정에서는 이동을 적용하지 않는다. 이전 ‘사용 문의/과정 보기’와 큰 제목·밑줄 보존 규칙보다 이 최신 요청이 우선한다. 승인된 노트북 이미지는 유지한다. `docs/hero-refinement.md`를 따른다.
- 상단은 단일 HeaderNavigation에 홈·기능·이용 안내·사용 과정·문의 5개만 둔다. 중복된 Header.actions의 안내/문의는 제거했다. 문의만 민트 CTA로 강조하며 기존 섹션 이동과 현재 선택 로직을 재사용한다. 링크별 고정 너비와 큰 빈 간격을 되살리지 않는다. 좁은 화면에서는 브랜드 아래 한 행으로 전체 메뉴를 표시한다. `docs/header-navigation-cleanup.md`를 따른다.
- 하단 연락 방법은 사용자 최신 요청으로 큰 문의 섹션 전체를 제거하고 푸터의 작은 사각 아이콘 7개(유튜브·커피컵·링크·이메일·RSS·인스타그램·스레드)로 통합했다. ‘사용 전에 확인해 주세요’ 제목·설명·큰 이메일 카드·따옴표·사용 안내 여백을 되살리지 않는다. `#contact`는 아이콘 모음에 유지한다. 이메일은 `support@hongsik.blog`로 연결하고, 미확인 채널 주소를 임의로 만들지 않는다. 연결 대기 문구·흐린 아이콘·비활성 표시 없이 동일한 스타일로 표시한다. 주소가 없는 채널은 내부 설정에만 남긴다.
- 2026-10-30 사용자 승인으로 참고 사이트의 내용 흐름과 TTJ 곡선 인터랙션을 반영한 로컬 시안을 만들었다. 현재 `src/app/page.tsx`는 Hero → 핵심 기능 미리보기 → 운영자 고민 → 곡선 기능 탐색 → 지원 채널 → 실행 안내 → 기본 사용 과정 → 문의 순서다. 이 요청 범위에서는 아래의 원본 섹션 순서·3개 큰 카드 보존 규칙보다 새 흐름이 우선한다. 브랜드·민트 색상·승인된 메인 이미지·정리된 문의/푸터는 유지한다. `docs/feature-journey-local.md`를 따른다.
- 운영자 고민 이후의 소개 섹션은 `src/components/overview/section-intro.tsx`의 작은 주제 표시 → 검정 제목 → 초록 강조 → 짧은 설명 계층을 공유한다. 섹션별 내용은 구분하고 기존 앵커·기능 카드·영상·곡선 인터랙션은 유지한다. `docs/section-intro-consistency.md`를 따른다.
- 이 시안은 사용자 확인 전 공개 배포·GitHub 전송을 하지 않는다. 기준 배포는 `f288b9a`다. `npm run build` 후 `npm run preview`로 `http://127.0.0.1:3130/`에서 확인하며 서버는 루프백에만 바인딩한다. HTML·정적 파일은 no-store로 제공한다.
- 곡선은 네 개의 SVG 구간과 다섯 기능 노드로 구성하며 수동 스크롤을 관찰만 한다. 휠 가로채기·스크롤 스냅·자동 페이지 넘김·새 애니메이션 라이브러리를 추가하지 않는다. 데스크톱 왼쪽은 sticky, 오른쪽은 쌓인 카드이며 모바일은 작은 고정 기능 탐색으로 바뀐다. 모든 본문은 JS 없이도 읽을 수 있다. 기본 사용 절차는 자료 준비 → AI 원고 작성 → 검토·발행을 유지한다.
- 대시보드는 사용자 제공 실제 앱 화면을 `public/images/dashboard-actual.png`로 사용한다. 02~05 카드의 기존 코드 기반 안내 그래픽은 사용자 제공 시연 영상으로 교체했으며, 이전 장식 그래픽을 함께 다시 표시하지 않는다. 영상은 기능 시연으로 설명하고 실시간 실행 결과로 오인하게 만들지 않는다. 색인은 요청·기록 관리로 설명하며 검색 반영을 보장하지 않는다.
- Figma 파일 `h2yyAh96bomjU0WmO6NRiw`, 원본 메인 프레임 `0:7` (1440×5850).
- 링크의 `2:5`는 Thumb 페이지이며 실제 시안은 Design 페이지에 있다.
- 실제 구현 기준은 별도 페이지 `115:2`의 PC `115:6`(1440×5850)와 모바일 `123:5`(390×약8781)다. 이전 `104:*` 재설계 초안은 폐기됐으며 `Archive · Superseded layout`에 남아 있다. 원본 두 페이지는 수정하지 않는다.
- PC는 원본 `0:7`을 직접 복제한 것으로 섹션 순서·좌우 배치·이미지/장식 위치·3개 카드 배열·원본 색상·크기·여백·하단의 어두운 문의/푸터를 유지한다. 이름·H 로고·문구·필요한 그래픽만 교체한다. 임의 FAQ나 4개 문자 카드를 새로 추가하지 않는다.
- 원본 노드별 문구는 `design/template-copy.json`, 현재 노드 매핑은 `design/template-state.json`, 엄격 비교 결과는 `design/template-audit.json`이다. `docs/template-correction.md`와 `docs/verification-template-correction.md`를 따른다.
- 사용자가 승인한 메인 이미지는 `public/images/hero-product.png`다. PC·모바일의 기존 인물/민트 배경/주변 카드 전체를 이 한 장으로 교체했으며, `design/hero-product-state.json`, `design/hero-product-audit.json`, `docs/hero-product-image.md`를 우선 적용한다. 나머지 레이아웃은 유지한다. 기존 그래픽 그룹은 복구 및 크기 보존을 위해 opacity 0으로 남아 있으므로 웹에 함께 렌더링하지 않는다.
- 사용 안내 아래 반복 H 로고 4개와 재생 버튼 행은 사용자 승인으로 제거했다. `docs/usage-marks-removal.md`, `design/usage-marks-removal.json`을 따른다. 사용 안내 문구와 문의 카드는 유지하고, 모바일 행의 98px 공간은 접는다. 이전 원본 감사·메인 이미지 교체 감사는 해당 변경 전 이력이다.
- 사용자 요청으로 ‘AI 원고는 발행 전에…’로 시작하는 3줄 문구(원본 `0:387`, PC `115:386`, 모바일 `123:480`)를 숨겼다. `docs/usage-notice-hidden.md`, `design/usage-notice-hidden.json`을 따른다. 웹에서도 해당 문구를 렌더링하지 않는다. 상단 메뉴는 한 페이지 내 섹션 이동 계획이며 이번 요청에서 메뉴 자체는 바꾸지 않았다.
- ‘과정 보기’의 재생 아이콘은 원형 아래쪽 화살표로 교체했다. `public/images/process-arrow-down.svg`, `design/process-arrow-state.json`, `docs/process-arrow.md`를 따른다. 버튼 문구·크기·위치를 유지하며 실제 섹션 이동은 4단계에서 연결한다.
- 5단계에서 사용자가 승인한 예외로 글자색의 대비를 보완했다. 밝은 배경의 회색 본문은 `#626d67`, 민트 위 글씨는 기존 진한 본문색 `#191a15`, 흰 배경의 초록 텍스트 링크는 `#237b57`을 사용한다. 민트 배경·배치·크기는 유지하며 어두운 문의/푸터의 회색은 기존 `#a6a6a6`을 보존한다. `docs/verification-stage-5.md`를 따른다.
- 사용자 승인으로 웹 푸터를 정리했다. 왼쪽 브랜드·소개·이메일 문의 하나, 오른쪽 ‘서비스 안내/주요 기능’ 2열, 최하단 저작권 한 줄로 구성한다. 최하단은 `© 2026 TTJ · ALL RIGHTS RESERVED` 형식의 대문자·자간 강조 문구를 사용한다. 기존 3열·중복 문의·Windows 앱 링크로 되돌리지 않는다. 기능 링크는 각 기능 카드의 고유 ID에 연결한다. 상세 내용은 `docs/footer-cleanup.md`에 있다.
- 사용자 요청으로 메뉴·CTA의 섹션 이동을 보완했다. ‘사용 문의’는 `#contact`로 연결하고, `AnchorFocus` 한곳에서 거리별 0.4~0.9초 이동·제목 위 32px 정렬·중단·도착 후 포커스를 처리한다. 실제 메일 앱 링크는 문의 카드·이메일 링크에 유지한다. `docs/section-navigation.md`를 따르며 별도 스크롤 라이브러리나 중복 애니메이션을 추가하지 않는다.
- 사용자 요청으로 기능 카드 순서를 PC·모바일 모두 ‘자료 준비 → AI 원고 작성 → 검토·발행’으로 맞췄다. 카드별 이미지·제목·설명·고유 ID를 묶어서 이동하며 원본 템플릿의 이전 순서로 되돌리지 않는다.
- 사용자 요청으로 데스크톱 장식 배경의 영역을 `max(1440px, 100%)`로 확장해 넓은 화면의 좌우 잘림을 제거했다. 배경 표시 크기·중심 위치·세로 좌표와 900px 이하 모바일 배치는 유지한다. 배경 위치의 50%는 이미지와 영역의 남는 폭 기준이므로 오프셋을 임의로 바꾸지 않는다.
- 직접 스크롤의 그리기 부담을 줄이기 위해 배경의 SVG 블러를 `public/images/glows/`의 미리 렌더링한 WebP로 제공한다. 원본 SVG는 보존하고 `npm run prepare:backgrounds`로 재생성한다. 자산 픽셀 비교는 `design/background-optimization.json`, 범위와 실제 성능 측정 한계는 `docs/scroll-performance.md`를 따른다. 거대한 will-change 레이어나 휠 가로채기를 추가하지 않는다.
- Tailwind Turbopack 로더는 `globals.css`에만 적용한다. `*.css`를 일반 CSS로 강제 처리하면 CSS Module의 스타일 매핑이 사라질 수 있다. 빌드 후 `node scripts/verify-export.mjs`로 화면 영역의 클래스·CSS 연결까지 확인한다.
- Figma MCP 스킬을 따라 디자인 정보·스크린샷을 읽고, 원본 템플릿을 보존하며 브랜드 시안을 구분한다.
- 생성된 절대 좌표 코드를 그대로 제품에 사용하지 않고 반응형 구조와 공통 컴포넌트로 구현한다.
- 가격·평점·회사 로고·인물·금융 문구는 템플릿의 예시이며 앱의 실제 정보가 아니다.
- `docs/implementation-plan.md`의 범주를 따라 한 단계의 변경·검증·다음 단계를 보고한다.

## 검증·Git·배포

- `npm run typecheck`, `npm run build`. 화면 완성 후 PC·모바일·키보드·CTA와 시안을 비교한다.
- 정적 결과물 `out/`을 AWS Nginx의 별도 사이트 경로에서 제공한다. Vercel은 사용하지 않는다.
- 로컬 Git은 이 프로젝트의 독립 저장소만 사용하고 `codex/` 브랜치에서 단계별 관련 파일만 커밋한다.
- GitHub·AWS·DNS·HTTPS 변경은 6단계에서 수행한다. 기존 사이트 백업·회귀 확인과 재배포 검증을 포함한다.
- 6단계에서 `https://github.com/misohong0520-hue/hongsik-blogworld-landing`의 공개 `main`과 `https://blogworld.hongsik.blog`를 연결했다. AWS는 `/var/www/hongsik-blogworld`와 전용 Nginx 설정을 사용한다. 재배포는 `docs/deployment.md`와 `scripts/package-release.mjs`를 따르고 WordPress 경로는 수정하지 않는다. 5단계의 브라우저·Lighthouse 미검증은 별도로 남아 있다.
- 앱 소스·실행 파일·프롬프트·계정·DB·브라우저 프로필·로그·서버 비밀키를 커밋하지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
