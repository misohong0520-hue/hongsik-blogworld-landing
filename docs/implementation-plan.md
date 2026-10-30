# 단계별 구현 계획

현재 상태: **1단계 기반·2단계 원본 직접 복제 시안 수정 완료**. 이전 재설계 초안은 폐기했으며 실제 홍보 화면 구현·인터랙션·공개 배포는 후속 단계다.

| 단계 | 범주 | 구현 범위 | 완료 기준 |
| --- | --- | --- | --- |
| 1 | 프로젝트 기반 | 독립 프로젝트·Git, App Router·TS·Tailwind·shadcn/ui, 공개 설정·파비콘, 정적 빌드, 작업 규칙·실행 문서 | 타입 검사·빌드 통과 |
| 2 | Figma 맞춤 시안 | 선택한 SaaS 템플릿을 초록 H·한국어·실제 앱 정보에 맞춰 PC·모바일로 구성 | 시안 프레임·섹션·디자인 규칙 확정 |
| 3 | 화면 구현 | 원본 순서의 Header·Hero·작업 라벨·Support·3개 Features·Benefits·3개 Process·Contact·Footer | 수정 Figma와 같은 배치·색상·반응형 골격 구현 |
| 4 | 인터랙션 | 원본 버튼·세그먼트의 섹션 이동/선택 상태, 문의 링크, 키보드 조작 | 원본 UI에 맞춘 주요 흐름과 JavaScript 인터랙션 실제 동작 |
| 5 | 검수 | 시안 비교, 반응형·접근성·CTA, 링크·이미지·콘솔, 메타정보·OG·Lighthouse | 발견한 문제 수정 및 검증 결과 기록 |
| 6 | GitHub·AWS 배포 | 소스 저장소, 서브도메인·Nginx·HTTPS, 기존 WordPress 확인, 재배포 | GitHub URL + 실제 배포 URL, README·복구 기록 |

## 확정 사항

- 이름: HongSik BlogWorld. 로고·파비콘: 사용자 제공 초록 H.
- 타깃: 자료 준비·AI 글 작성·발행을 반복하는 개인 운영자와 소규모 사업자, 상위 노출을 목표로 키워드 선정을 자동화하고 싶은 운영자.
- 주요 CTA: 사용 문의, `mailto:support@hongsik.blog`.
- 배포 주소: `https://blogworld.hongsik.blog`. AWS EC2 Nginx에서 WordPress와 경로·호스트 분리. Vercel 사용 안 함.
- 원본 시안: https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/Saas-Landing-Pages--Community-?node-id=0-7

## 1단계 경계

첫 화면은 기반 연결을 확인하는 최소 화면이며 Figma 디자인 구현 완료 화면이 아니다.
가격·고객 후기·다운로드 파일·회원가입·결제·AI 실행 기능은 추가하지 않는다.
최종 2단계는 별도 Figma 페이지 `115:2`의 PC·모바일 시안이다. PC는 원본 프레임을 직접 복제하고 581개 원본 노드와 비교했다. 디자인은 `docs/template-correction.md`, 검증은 `docs/verification-template-correction.md`를 따른다. `104:*` 및 기존 2단계 문서는 폐기 초안 기록이다.
