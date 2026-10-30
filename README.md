# HongSik BlogWorld landing page

HongSik BlogWorld 앱을 홍보하는 한국어 랜딩페이지입니다. Codeit 미션 5의 기획 → Figma 디자인 → 구현 → 검수 → 배포 흐름으로 진행합니다.

**AWS 서브도메인 배포와 GitHub 공개 소스 등록을 완료했습니다.**

- 배포 URL: [blogworld.hongsik.blog](https://blogworld.hongsik.blog/)
- GitHub URL: [misohong0520-hue/hongsik-blogworld-landing](https://github.com/misohong0520-hue/hongsik-blogworld-landing)
- 배포 검증: HTTPS·정적 파일 198개·압축·캐시·404·재배포·롤백·인증서 갱신 모의 실행 통과, 기존 WordPress 유지 확인.

타입 검사·빌드·에셋/링크/스타일 연결 검사와 DOM 테스트 9개를 통과했습니다. 실제 브라우저 정밀 검수와 Lighthouse는 도구 연결 오류로 아직 완료하지 못했습니다. [5단계의 남은 검수](docs/verification-stage-5.md)와 [6단계 배포 결과](docs/verification-stage-6.md)를 확인하세요.

사용자 요청으로 푸터의 중복 메뉴를 제거하고 서비스 안내·주요 기능 2열과 이메일 문의 하나로 정리했습니다. 기능 링크는 각 카드로 연결합니다. [푸터 개선 기록](docs/footer-cleanup.md).

이메일 문의 카드의 입력창처럼 보이던 정적 안내를 받는 주소·설명으로 바꿨습니다. 실제 ‘메일 앱 열기’ 버튼으로 작성창을 열고, 메일 앱이 열리지 않으면 표시된 주소를 복사해 사용할 수 있습니다. [문의 카드 수정 기록](docs/contact-card-clarity.md).

## 확정된 운영 정보

- 대상: 반복적인 블로그 운영 작업과 키워드 선정 자동화를 원하는 개인 운영자·소규모 사업자
- 문의: `support@hongsik.blog`
- 운영 주소: `https://blogworld.hongsik.blog`
- GitHub: 공개 저장소, 기본 브랜치 `main`. 로컬 작업은 `codex/` 브랜치를 사용
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
npm run test:interactions
npm run build
node scripts/verify-export.mjs
node scripts/check-contrast.mjs
```

빌드 결과는 `out/`입니다. AWS Nginx의 별도 사이트에서 정적 파일만 제공하며 Vercel은 사용하지 않습니다.
재배포할 때는 소스를 커밋한 뒤 `npm run package:release`로 검증된 아카이브를 만들고, 서버의 릴리스 연결을 바꿉니다. 패키지 생성·전송·HTTPS·복구 절차는 [배포 문서](docs/deployment.md)를 따릅니다. 공개 배포 후에는 같은 패키지의 로컬 `out/`을 기준으로 `node scripts/verify-deployment.mjs`를 실행합니다.

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
deploy/                   Nginx 설정·릴리스 설치·인증서 갱신 훅
scripts/package-release.mjs 검증된 정적 릴리스 패키지 생성
scripts/verify-deployment.mjs 공개 파일·TLS·캐시·기존 사이트 검사
```

`src/components/header/`, `hero/`, `workflow/`, `support/`, `features/`, `benefits/`, `process/`, `contact/`, `footer/`에 원본 템플릿 순서의 실제 섹션을 구성했습니다.
별도 URL이 필요하면 `src/app/<경로>/page.tsx`로 추가합니다.

## 검증 범위

5단계에서 정적 검증을 강화했습니다. 단순 파일 존재뿐 아니라 CSS Module 이름의 누락, 화면 영역과 스타일의 연결, 상대 경로 폰트, 접근성 라벨·제목 순서·중복 ID, canonical·OG·Twitter·robots·sitemap을 검사합니다. 공유 이미지는 승인받은 제품 이미지 PNG를 재사용합니다.
기본 HTML 앵커·메일 앱 연결을 유지하면서, 4단계에서 현재 섹션 메뉴 표시와 앵커 이동 후 키보드 포커스를 추가했습니다. 부드러운 스크롤은 동작 줄이기 설정을 존중합니다. `npm run test:interactions`는 실제 브라우저가 아닌 메모리상의 DOM에서 이벤트·포커스·현재 섹션 상태를 검증합니다. 원래 브라우저의 스크롤·이력·메일 앱 실행까지 검증한 것은 아닙니다.
정적 색상 검사에서는 주요 전경·배경 조합 10개가 4.5:1 이상입니다. 실제 브라우저의 그라데이션 합성·초점·글꼴·줄바꿈·모바일 배치까지 통과했다는 뜻은 아닙니다.
공개 HTTPS 주소의 HTML 일치·전체 릴리스 파일·MIME·캐시·압축·404와 기존 WordPress의 응답·제목·리다이렉트를 확인했습니다. 재배포→이전 버전 복구→최신 버전 복원을 실제 실행했습니다. 인증서 자동 갱신 타이머와 갱신 모의 실행도 확인했습니다.
5단계의 실제 화면 비교·키보드·접근성·Lighthouse와 시크릿 창 검수는 아직 남아 있습니다. 네트워크 검사나 DOM 단위 테스트로 이를 통과했다고 판단하지 않습니다.

자세한 내용은 [단계별 구현 계획](docs/implementation-plan.md), [원본 정렬 디자인 인계](docs/template-correction.md), [1단계 검증](docs/verification-stage-1.md), [최종 시안 검증](docs/verification-template-correction.md)을 참고하세요.
기존 앱 소스·프롬프트·계정·DB·브라우저 프로필·서버 비밀키는 이 저장소에 포함하지 않습니다.
디자인·이미지·폰트 출처는 [제3자 출처 문서](THIRD_PARTY_NOTICES.md)에 정리했습니다.
