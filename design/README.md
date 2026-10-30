# Figma 디자인 원본과 인계 자료

최신 메인 이미지는 사용자 승인 `../public/images/hero-product.png`로 교체됐다. `hero-product-state.json`, `hero-product-audit.json`, [메인 이미지 교체 기록](../docs/hero-product-image.md)을 함께 따른다. 원본 인물·민트 배경·장식 카드는 하나의 제품 이미지로 대체하며 중복 렌더링하지 않는다. `desktop-template.png`와 `mobile-template.png`도 교체 후 화면으로 갱신했다.

**현재 구현 기준은 원본 직접 복제 시안이다.** [최종 PC](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/HongSik-BlogWorld?node-id=115-6) · [최종 모바일](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/HongSik-BlogWorld?node-id=123-5). `template-state.json`, `template-copy.json`, `figma-template-clone.js`, `figma-template-apply.js`, `figma-template-audit.js`, `figma-template-mobile.js`와 [수정 기록](../docs/template-correction.md)을 따른다. 비교용 PNG는 `desktop-template.png`와 `mobile-template.png`다. 아래 기존 `104:*` 시안과 `figma-state.json`은 폐기 초안의 이력이며 실제 웹 구현에 사용하지 않는다.

- 파일: `h2yyAh96bomjU0WmO6NRiw`
- 브랜드 페이지: `104:2` (`HongSik · Landing / Stage 2`)
- [PC 1440px](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/HongSik-BlogWorld?node-id=104-45)
- [모바일 390px](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/HongSik-BlogWorld?node-id=104-46)
- [모바일 메뉴 열림](https://www.figma.com/design/h2yyAh96bomjU0WmO6NRiw/HongSik-BlogWorld?node-id=106-101)

PNG는 검수·비교용 출력이다. 편집 원본은 Figma의 텍스트·오토레이아웃·컴포넌트이며 전체 화면을 래스터 이미지로 구성하지 않았다.

## 소스 기록

`figma-foundation.js` → H 로고 업로드 → `figma-compose.js` → `figma-menu.js` 순서로 구성했다. 이 파일은 **Figma MCP `use_figma`의 Plugin API 본문**이며 Node.js 실행 파일이나 웹 런타임 파일이 아니다. 디자인 보정은 소스 기록에도 반영했다.

- `figma-foundation.js`: 별도 페이지·24개 변수·9개 텍스트 스타일·공통 버튼·로고·빈 PC/모바일 프레임.
- `figma-compose.js`: 기능 카드·FAQ 컴포넌트와 PC/모바일 섹션. `state`에 기반 생성 결과를 전달한다.
- `figma-menu.js`: 모바일 메뉴 열림 화면·프로토타입 연결. `state.composition`에 전체 구성 결과가 필요하다.
- `figma-state.json`: 실제 생성 노드·컴포넌트 속성·마지막 구조 검사 결과. 과거 생성 목록과 최종 노드 목록을 구분한다.

재개할 때는 `figma-state.json`의 ID와 실제 Figma 상태를 확인한다. 원본 페이지나 기존 브랜드 페이지를 지우고 다시 실행하지 않는다. 세 스크립트의 중복 생성 방지 조건도 유지한다.

아이콘 SVG 경로는 설치된 `lucide-react` 1.64.0의 arrow-right/menu/plus/check/x에서 가져왔다(ISC). H 로고는 사용자 제공 파일이며 템플릿 사진·기업 로고를 가져오지 않았다.

화면 설명·전체 카피·색상·여백·반응형 인계 기준은 [디자인 인계](../docs/design-stage-2.md), 확인 범위는 [검증 기록](../docs/verification-stage-2.md)을 따른다.
