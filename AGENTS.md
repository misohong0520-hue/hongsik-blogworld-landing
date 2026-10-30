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
- 브랜드 시안은 별도 페이지 `104:2`에 있다. PC `104:45`(1440×3678), 모바일 `104:46`(390×5766), 메뉴 열림 `106:101`(390×498). 원본 두 페이지를 수정하지 않는다.
- Figma MCP 스킬을 따라 디자인 정보·스크린샷을 읽고, 원본 템플릿을 보존하며 브랜드 시안을 구분한다.
- 생성된 절대 좌표 코드를 그대로 제품에 사용하지 않고 반응형 구조와 공통 컴포넌트로 구현한다.
- 가격·평점·회사 로고·인물·금융 문구는 템플릿의 예시이며 앱의 실제 정보가 아니다.
- `docs/implementation-plan.md`의 범주를 따라 한 단계의 변경·검증·다음 단계를 보고한다.

## 검증·Git·배포

- `npm run typecheck`, `npm run build`. 화면 완성 후 PC·모바일·키보드·CTA와 시안을 비교한다.
- 정적 결과물 `out/`을 AWS Nginx의 별도 사이트 경로에서 제공한다. Vercel은 사용하지 않는다.
- 로컬 Git은 이 프로젝트의 독립 저장소만 사용하고 `codex/` 브랜치에서 단계별 관련 파일만 커밋한다.
- GitHub·AWS·DNS·HTTPS 변경은 6단계에서 수행한다. 기존 사이트 백업·회귀 확인과 재배포 검증을 포함한다.
- 앱 소스·실행 파일·프롬프트·계정·DB·브라우저 프로필·로그·서버 비밀키를 커밋하지 않는다.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
