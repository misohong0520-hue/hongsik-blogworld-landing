# HongSik BlogWorld landing page

HongSik BlogWorld 앱을 홍보하는 한국어 랜딩페이지입니다. Codeit 미션 5의 기획 → Figma 디자인 → 구현 → 검수 → 배포 흐름으로 진행합니다.

**현재는 1단계 프로젝트 기반만 구성했습니다.** 첫 화면은 기반 확인용이며 최종 Figma 시안 구현 화면이 아닙니다.

## 확정된 운영 정보

- 대상: 반복적인 블로그 운영 작업과 키워드 선정 자동화를 원하는 개인 운영자·소규모 사업자
- 문의: `support@hongsik.blog`
- 예정 주소: `https://blogworld.hongsik.blog` — 아직 배포하지 않음
- GitHub: 6단계에서 생성·연결 예정. 현재는 독립 로컬 Git 저장소
- 브랜드: 사용자 제공 초록 H 로고·파비콘
- Figma: [SaaS Landing Pages 메인 프레임](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/Saas-Landing-Pages--Community-?node-id=0-7)

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
npm run build
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
src/lib/site.ts            이름·도메인·문의 등 공개 설정
public/brand/              공개 브랜드 이미지
```

3단계에서 `src/components/header/`, `hero/`, `features/`, `workflow/`, `faq/`, `footer/`에 실제 섹션을 구성합니다.
별도 URL이 필요하면 `src/app/<경로>/page.tsx`로 추가합니다.

## 검증 범위

1단계의 타입 검사·정적 빌드·메인과 아이콘 HTTP 200·문의 링크 의미를 확인했습니다. 로컬 커밋으로 기록합니다.
최종 인터랙션은 4단계, 시안 비교·반응형·접근성·Lighthouse는 5단계, 공개 주소·시크릿 창·기존 WordPress·재배포는 6단계에서 확인합니다.

자세한 내용은 [단계별 구현 계획](docs/implementation-plan.md)과 [1단계 검증 기록](docs/verification-stage-1.md)을 참고하세요.
기존 앱 소스·프롬프트·계정·DB·브라우저 프로필·서버 비밀키는 이 저장소에 포함하지 않습니다.
