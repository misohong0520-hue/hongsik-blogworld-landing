# 스크롤 연동 기능 시연 영상 — 2026-10-30

사용자가 제공한 영상 네 개를 기존 곡선 인터랙션의 기능 카드에 배치하고, 화면 중앙 진입 시 자동재생하는 방식을 승인했다. 재생 종료 시 반복하도록 마지막 지침을 반영했다. 기준 커밋 `75b3de6`, 브랜치 `codex/scroll-feature-videos`. 로컬 확인까지만 진행하며 공개 배포·GitHub 전송은 승인 전까지 하지 않는다.

## 영상과 배치

| 원본 URL | 위치 | 길이 | 크기 |
| --- | --- | --- | --- |
| https://blogfactory.kr/detail/blog-factory/features/writing.mp4 | 02 AI 글쓰기 | 21.867초 | 1,807,309B |
| https://blogfactory.kr/detail/blog-factory/features/cardnews.mp4 | 03 카드뉴스·숏폼 중 카드뉴스 | 22.100초 | 1,946,281B |
| https://blogfactory.kr/detail/blog-factory/features/repost.mp4 | 04 발행·리포스트 중 리포스트 | 14.600초 | 1,227,445B |
| https://blogfactory.kr/detail/blog-factory/features/indexing.mp4 | 05 자동 실행·색인 중 색인 | 18.934초 | 1,536,442B |

네 파일 모두 860×484이며 해당 비율로 공간을 미리 확보한다. HTTP 200, Range 206, 파일 시작 32바이트의 fast-start moov를 읽기 전용으로 확인했다. 각 파일의 앞 256KiB만 읽어 메타데이터를 확인했으며 영상을 내려받아 저장하거나 변경하지 않았다. 네 영상은 원본 URL을 직접 사용한다. 새 플레이어 라이브러리·영상 호스팅 서비스를 추가하지 않았다.

대시보드의 기존 실제 앱 캡처와 왼쪽 곡선은 유지한다. 나머지 네 카드의 안내 그래픽은 영상으로 교체하고 사용하지 않는 그래픽 CSS를 제거했다. 영상 이름과 캡션으로 카드뉴스/숏폼, 자동 글쓰기/색인을 구분한다.

## 재생 동작

- `FeatureVideo`는 서버에서 기본 video 요소를 렌더링한다. poster·별도 재생 CTA는 없으며 muted / loop / playsInline / controls / preload=none을 적용한다. HTML autoplay는 사용하지 않는다.
- `FeatureVideoMotion` 한 곳에서 재생을 관리한다. 중앙선이 영상 안에 있고 충분히 보이는 영상이 180ms 머무르면 시작한다. 빠르게 지나가면 시작 예약을 취소한다.
- 새 영상이 중앙에 들어오면 이전 영상은 정지한다. 다른 중앙 영상이 없을 때에는 기존 영상이 20% 이상 보이는 동안 계속 재생한다. 화면을 벗어나면 정지한다.
- 재생 시간은 초기화하지 않아 다시 돌아오면 이전 위치에서 이어진다. 끝나면 native loop로 반복한다.
- 수동 일시정지는 화면을 떠날 때까지 유지한다. 기본 컨트롤로 수동 재생·일시정지·전체화면을 사용할 수 있다.
- 탭이 숨겨지면 모두 정지하고, 다시 보이면 중앙 영상을 다시 판단한다.
- 동작 줄이기에서는 자동재생을 끈다. 기본 컨트롤의 수동 재생은 가능하다.
- IntersectionObserver로 600px 근처 영상부터 metadata를 준비한다. scroll은 passive + RAF 합치기이며 휠·터치 스크롤을 가로채지 않는다.
- 이전 play 요청이 늦게 완료돼도 새 영상과 동시에 재생하지 않도록 무효화한다. 재생 거부 시 같은 위치에서 무한 재시도하지 않는다. 기본 컨트롤로 직접 시작할 수 있다.

## 검증

- 타입 검사·프로덕션 빌드 통과.
- DOM 동작 검사 40개 통과: 기존 28개와 새 미디어 프로토콜 12개. 중앙 지연·빠른 통과·단일 재생·역스크롤 위치 유지·수동 정지·탭 숨김·동작 줄이기·거부 복구·늦은 완료·정리 처리를 검증했다.
- 정적 export 검사에서 네 영상의 원본 주소·muted·loop·playsInline·controls·preload·치수·라벨 및 poster/autoplay 부재를 확인한다.
- 로컬 HTTP의 영상 요소·캡션·외부 원본 경로와 CSS 연결을 확인한다.
- 실제 브라우저 도구는 `Local browser use is disabled in Work settings`를 반환했다. 실제 디코딩·모바일 자동재생·스크롤 체감·네이티브 컨트롤의 표시 형태는 미검증이다. DOM 검사나 메타데이터 검사로 실제 재생까지 통과했다고 주장하지 않는다.

로컬 확인: http://127.0.0.1:3130/?review=scroll-feature-videos#feature-writing

`npm run build` 후 `npm run preview`로 실행한다. 브라우저가 자동재생을 제한하거나 동작 줄이기를 사용하면 기본 컨트롤로 직접 재생할 수 있다.
