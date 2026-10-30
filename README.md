# HongSik BlogWorld landing page

HongSik BlogWorld 앱을 홍보하는 한국어 랜딩페이지입니다. Codeit 미션 5의 기획 → Figma 디자인 → 구현 → 검수 → 배포 흐름으로 진행합니다.

**1·2단계에 이어 3단계 랜딩 화면 코드를 구현했습니다.** 최종 Figma의 PC·모바일 구성과 승인된 제품 이미지를 반영했습니다. 타입 검사·린트·정적 빌드·에셋/링크 검증은 통과했으며, 실제 브라우저 화면 비교는 도구 연결 오류로 아직 수행하지 못했습니다. [3단계 구현·검증 기록](docs/verification-stage-3.md)을 확인하세요.

## 확정된 운영 정보

- 대상: 반복적인 블로그 운영 작업과 키워드 선정 자동화를 원하는 개인 운영자·소규모 사업자
- 문의: `support@hongsik.blog`
- 예정 주소: `https://blogworld.hongsik.blog` — 아직 배포하지 않음
- GitHub: 6단계에서 생성·연결 예정. 현재는 독립 로컬 Git 저장소
- 브랜드: 사용자 제공 초록 H 로고·파비콘
- Figma: [SaaS Landing Pages 메인 프레임](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/Saas-Landing-Pages--Community-?node-id=0-7)
- 최종 시안: [원본 레이아웃을 유지한 PC](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/HongSik-BlogWorld?node-id=115-6) · [같은 구성의 모바일](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/HongSik-BlogWorld?node-id=123-5)
- 메인 이미지: 사용자 제공 실제 앱 화면을 담은 노트북 이미지로 PC·모바일 Figma와 웹 화면에 적용했습니다. [교체 기록](docs/hero-product-image.md).
- 하단 사용 안내의 반복 로고·재생 버튼 행 제거 완료. [수정 기록](docs/usage-marks-removal.md). 모바일의 해당 여백도 줄였습니다.
- 하단의 요청한 안내 문구 3줄을 PC·모바일에서 숨겼습니다. [변경 기록](docs/usage-notice-hidden.md). 상단 메뉴의 섹션 연결 계획은 [구현 계획](docs/implementation-plan.md)에 있습니다.
- ‘과정 보기’의 재생 아이콘을 아래쪽 화살표로 교체했습니다. [교체 기록](docs/process-arrow.md).

## 기술과 실행

Next.js App Router · TypeScript · React · Tailwind CSS · shadcn/ui · npm.
버전은 `package.json`과 `package-lock.json`에서 관리합니다. Node.js 24, npm 11 환경에서 기반을 확인합니다.

```bash
npm ci
npm run dev
```

개발 서버가 출력하는 Local 주소를 엽니다. 기본 포트는 3000입니다.

```bash
npm run typecheck
npm run lint
npm run build
node scripts/verify-export.mjs
```

빌드 결과는 `out/`입니다. 완성된 정적 파일을 AWS Nginx에서 제공하며 Vercel은 사용하지 않습니다.
GitHub 업로드·DNS·HTTPS·Nginx 변경과 공개 URL 검증은 6단계에서 진행합니다.

## 구조와 제어 파일

```text
package.json               실행·검증·빌드 명령
next.config.ts             정적 빌드 설정
AGENTS.md                  AI 작업 맥락·범위·검증 규칙
docs/implementation-plan.md 단계별 범위·완료 기준
src/app/layout.tsx         공통 문서 구조·메타정보
src/app/page.tsx           메인 화면 조합
src/app/favicon.ico        브라우저 탭 아이콘
src/app/icon.png           초록 H 사이트 아이콘
src/components/ui/         shadcn/ui 공통 요소
src/components/<영역>/     섹션별 TSX·CSS 모듈
src/lib/site.ts            이름·도메인·문의 등 공개 설정
public/brand/              공개 브랜드 이미지
public/images/             사용자 승인 제품 이미지
public/figma/              현재 화면에 사용하는 Figma 에셋
design/stage3-assets.json  에셋·원본 노드 연결 기록
```

`src/components/header/`, `hero/`, `workflow/`, `support/`, `features/`, `benefits/`, `process/`, `contact/`, `footer/`에 원본 템플릿 순서의 실제 섹션을 구성했습니다.
별도 URL이 필요하면 `src/app/<경로>/page.tsx`로 추가합니다.

## 검증 범위

3단계의 타입 검사·린트·정적 빌드·에셋 존재·앵커 대상·문의 링크를 확인했습니다. 실제 화면의 글꼴·줄바꿈·반응형·키보드 동작은 브라우저 연결 복구 후 검증해야 합니다.
현재 메뉴와 버튼은 기본 HTML 앵커와 메일 앱 연결입니다. JavaScript 인터랙션은 4단계, 최종 시안 비교·접근성·Lighthouse는 5단계, 공개 주소·시크릿 창·기존 WordPress·재배포는 6단계에서 진행합니다.

자세한 내용은 [단계별 구현 계획](docs/implementation-plan.md), [원본 정렬 디자인 인계](docs/template-correction.md), [1단계 검증](docs/verification-stage-1.md), [최종 시안 검증](docs/verification-template-correction.md)을 참고하세요.
기존 앱 소스·프롬프트·계정·DB·브라우저 프로필·서버 비밀키는 이 저장소에 포함하지 않습니다.
