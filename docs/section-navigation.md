# 섹션 이동 개선

기준 커밋 `c45a6f3`. 사용자 요청은 ‘사용 문의·과정 보기·상단 메뉴로 섹션을 이동하는 느낌이 부자연스럽다’는 내용이다. 화면의 배치·색상·본문은 유지하고 이동 동작만 보완한다.

## 확인한 내용

- Hero와 기능 영역의 ‘사용 문의’가 문의 섹션이 아닌 `mailto:`로 연결돼 있었다.
- 섹션 앵커는 최대 130px의 상단 패딩 시작에 정렬돼 실제 제목 위에 넓은 빈 공간이 남았다.
- 기존 smooth의 속도·감속은 브라우저에 맡기고 있었다. 실제 화면 재현 없이 이중 스크롤이 원인이라고 단정하지 않는다.
- 현재 메뉴만 16px에서 18px로 커졌다. 활성 상태는 색상으로 구분하고 크기는 유지한다.

## 현재 동작

- ‘사용 문의’ 두 곳은 `#contact`로 이동한다. 메일 작성은 문의 카드의 실제 메일 링크에서 시작한다.
- 일반 섹션 클릭은 `AnchorFocus` 한곳에서 처리한다. 이동 거리에 따라 400~900ms 동안 완만하게 가속·감속한다. 각 프레임은 `behavior: instant`로 위치를 적용해 CSS smooth와 중복 실행되지 않게 한다.
- 섹션은 제목 위 32px, 기능 카드는 카드의 시작 위 32px에 정렬한다. 홈은 문서 맨 위다. 문서의 시작과 마지막 스크롤 범위를 넘지 않는다.
- 이동을 마친 후에만 제목에 `preventScroll`로 포커스를 준다. 기존 임시 tabindex 정리는 유지한다.
- 새 메뉴 클릭은 현재 위치에서 새 이동을 시작한다. 휠·터치·포인터 조작, 스크롤 키·Tab·Escape, 창 크기 변경·이력 이동은 이전 이동과 예약 포커스를 취소한다.
- 동작 줄이기 설정과 본문 바로가기는 즉시 이동한다. 같은 해시를 다시 클릭해도 이동하며 이력을 중복 추가하지 않는다.
- URL 해시·기존 history.state를 보존한다. 직접 해시 진입과 뒤로/앞으로의 스크롤 복원은 브라우저에 맡긴다. 수정키·중간 클릭·새 탭·다운로드·메일·외부·없는 해시 링크는 가로채지 않는다. JavaScript가 없으면 기존 href가 동작한다.

## 검증과 한계

메모리상의 DOM 테스트 18개에서 도착점·가속/감속 진행·이력 API 호출·도착 후 포커스·중단·새 이동·동작 줄이기·동일 해시·본문 바로가기·범위 제한·기본 링크 제외 조건을 확인했다. Happy DOM은 pushState에서도 hashchange를 발생시키므로, 테스트에서는 명세에 맞게 해당 API를 격리하고 이력 이벤트를 명시적으로 전달한다.

브라우저 도구는 `Local browser use is disabled in Work settings`를 반환했다. 실제 PC·모바일의 이동감과 브라우저 이력 복원은 이 DOM 테스트로 검증했다고 주장하지 않는다.

근거 문서: [MDN scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scroll-behavior), [MDN pushState](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState). 설치된 Next.js의 `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`에서 Native History API 지원도 확인했다.
