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
- 사용자 승인으로 웹 푸터를 정리했다. 왼쪽 브랜드·소개·이메일 문의 하나, 오른쪽 ‘서비스 안내/주요 기능’ 2열, 최하단 저작권·도메인으로 구성한다. 기존 3열·중복 문의·Windows 앱 링크로 되돌리지 않는다. 기능 링크는 각 기능 카드의 고유 ID에 연결한다. 상세 내용은 `docs/footer-cleanup.md`에 있다.
- 사용자 요청으로 메뉴·CTA의 섹션 이동을 보완했다. ‘사용 문의’는 `#contact`로 연결하고, `AnchorFocus` 한곳에서 거리별 0.4~0.9초 이동·제목 위 32px 정렬·중단·도착 후 포커스를 처리한다. 실제 메일 앱 링크는 문의 카드·이메일 링크에 유지한다. `docs/section-navigation.md`를 따르며 별도 스크롤 라이브러리나 중복 애니메이션을 추가하지 않는다.
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
