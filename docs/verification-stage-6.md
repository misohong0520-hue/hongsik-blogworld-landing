# 6단계 GitHub·AWS 배포 결과

확인일: 2026-10-30. 사용자가 다음 단계 진행을 요청해 GitHub·AWS 배포를 수행했다.

## 제출 주소

- 배포: https://blogworld.hongsik.blog/
- 소스: https://github.com/misohong0520-hue/hongsik-blogworld-landing
- GitHub 공개 범위: PUBLIC, 기본 브랜치 `main`.

배포 릴리스는 `b6d749f2b0cc88d4ac3e87ff48107c4daffab45f`다. 공개 `/deployment.json`에서 확인할 수 있다. 이후 문서만 추가된 커밋은 운영 릴리스와 다를 수 있다.

## 배포 구성

- 기존 AWS 서버에 별도 `/var/www/hongsik-blogworld/releases/<sha>`를 만들고 `current` 연결로 제공한다. 이전 릴리스는 `previous`로 보존한다.
- 전용 Nginx 가상 호스트만 추가했다. WordPress의 루트·DB·설정은 수정하지 않았다.
- 변경 전 Nginx 설정을 서버의 접근 제한된 백업 폴더에 보관했다. 기존 설정 파일의 SHA-256을 배포 후 비교해 변경 없음도 확인했다.
- 사용자가 Namecheap의 `blogworld` A 레코드를 추가했다. 권한 DNS·공용 리졸버·서버에서 대상 IP가 일치함을 확인했다.
- HTTPS 인증서는 해당 서브도메인에 별도로 발급했다. 기존 ACME 계정을 재사용했고 다른 인증서나 계정 연락처는 변경하지 않았다. 현재 인증서 만료일은 2027-01-28이다.
- HTTP는 HTTPS로 이동한다. HTML은 재검증하도록 제공하고, 해시된 Next 정적 자산은 immutable, 고정 파일명의 이미지는 짧은 캐시로 제공한다. 텍스트 자산은 gzip으로 압축한다.

## 검증 결과

| 항목 | 결과 |
| --- | --- |
| 타입 검사·정적 빌드 | 통과 |
| 인터랙션 DOM 테스트 | 9개 통과 |
| 빌드 에셋·CSS 연결·메타정보 검사 | 통과, undefined 클래스 0개 |
| 릴리스 패키지 | 정적 파일 198개, 파일별 SHA-256 검증 통과 |
| 최종 아카이브 SHA-256 | `85b1722230cd8106d566cb067d4b57467032d3279122a850dfe1b30dd4983808` |
| 공개 HTTPS | 인증서 검증을 끄지 않은 TLS 요청으로 200 확인 |
| HTTP 리다이렉트 | 정확한 HTTPS 주소로 301 |
| 공개 HTML | 검증한 로컬 빌드와 SHA-256 일치 |
| 전체 릴리스 파일 | 198개 HEAD 응답 200, 해당 확장자 MIME 확인 |
| 캐시·압축 | HTML no-cache, Next 정적 자산 immutable, gzip 확인 |
| 없는 주소 | 404 확인 |
| 기존 WordPress | 기본/WWW 주소 모두 200, 최종 주소·제목이 배포 전과 같음 |
| Nginx 기존 설정 | 배포 전 파일 체크섬과 동일, `nginx -t` 통과 |
| 재배포·복구 | 첫 릴리스→최신→이전 복구→최신 복원, 각 단계의 공개 버전 확인 |
| 인증서 자동 갱신 | certbot 타이머 enabled·active, 해당 인증서 dry-run 및 deploy hook 성공 |
| GitHub | 공개 저장소의 main에 운영 소스 커밋 업로드 확인 |

재배포·복구는 `98502578a20e1cc63f6c941d68f156b48be24173`와 최종 릴리스 간에 실제로 수행했다. 현재 포인터는 최종 릴리스, 이전 포인터는 첫 릴리스다. 롤백 중에도 같은 화면 구성의 검증된 정적 파일을 제공했다.

반복 검증은 `npm run package:release`와 `node scripts/verify-deployment.mjs`를 사용한다. 서버 설정·백업·인증서 절차는 `deployment.md`에 있다.

## 검증 한계

공개 페이지에서도 브라우저 도구가 `Local browser use is disabled in Work settings`를 반환했다. 공개 URL의 페이지 열기를 요청했지만, 도구로 실제 화면·콘솔·시크릿 창을 검사하거나 Lighthouse를 실행하지는 못했다. 모바일·키보드·접근성 전체 통과나 Lighthouse 점수는 보고하지 않는다. 사용자에게 앞서 받은 기본 배치 정상 확인과 정적/DOM/네트워크 검사 결과를 구분한다.

Git 이력의 비밀키·API 키·DB·브라우저 프로필·로그 경로와 주요 비밀 패턴을 검사했으며 발견하지 못했다. 앱 실행 파일이나 서버 비밀키는 업로드하지 않았다. 디자인·에셋·폰트의 출처와 확인 범위는 `THIRD_PARTY_NOTICES.md` 및 공개 `third-party-notices.txt`에 유지한다.
