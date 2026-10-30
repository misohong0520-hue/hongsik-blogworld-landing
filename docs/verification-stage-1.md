# 1단계 검증 기록

확인일: 2026-10-30 (Asia/Seoul).

## 확인 범위

- 독립 프로젝트·로컬 Git 저장소, App Router·TypeScript·Tailwind·shadcn/ui.
- 확정된 이름·문의 이메일·도메인과 초록 H 파비콘.
- 공통 문서 구조·공개 설정·기반 화면, 정적 빌드 출력.
- 이 단계의 첫 화면은 기반 확인용이다. 원본 Figma 시안을 구현한 최종 홍보 화면은 아니다.

## 확인 결과

| 항목 | 결과 |
| --- | --- |
| 잠금 파일 기준 재설치 `npm ci` | 통과, 재설치 후 타입 검사·빌드도 통과 |
| 타입 검사 `npm run typecheck` | 통과 |
| 정적 빌드 `npm run build` | 통과, `out/` 생성 |
| 메인 페이지 HTTP | `/` 200, 한국어 문서·사이트 이름·문의 링크 확인 |
| 아이콘 HTTP | `/favicon.ico`, `/icon.png`, `/brand/icon.png` 모두 200 |
| 문의 링크 의미 | 정적 HTML의 `mailto:support@hongsik.blog`가 실제 링크이며 `role="button"` 없음 |
| 파비콘 호환 | 16·32·48·256px의 PNG를 RGBA로 감싼 ICO. 원본과 RGBA 픽셀 비교 일치 |
| 원본 디자인 정보 | Figma 메인 프레임 `0:7`과 메타정보·스크린샷 조회 완료. 시안 수정 없음 |
| 변경 범위 | 새 랜딩페이지 프로젝트만 작성. 기존 앱·WordPress·AWS/DNS 설정 변경 없음 |

## 후속 확인

Figma 브랜드 맞춤 시안은 2단계, 전체 홍보 화면은 3단계, 실제 인터랙션은 4단계에서 만든다.
실제 브라우저 시안 비교·모바일·접근성·Lighthouse는 5단계에서 검증한다.
GitHub 업로드와 AWS 공개 URL·HTTPS·재배포·기존 사이트 회귀는 6단계에서 확인한다.
로컬 개발 서버는 HTTP 확인 후 종료했다.
