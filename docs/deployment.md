# GitHub·AWS 정적 배포

대상은 `https://blogworld.hongsik.blog`다. 기존 WordPress의 사이트 설정·루트·DB를 수정하지 않고 별도 Nginx 가상 호스트와 `/var/www/hongsik-blogworld`를 사용한다. Vercel이나 Node 상시 서버는 사용하지 않는다.

## 빌드와 패키지

```bash
npm ci
npm run typecheck
npm run test:interactions
# 소스 변경은 먼저 로컬 커밋으로 남긴다.
npm run package:release
```

패키지 명령은 깨끗한 Git 상태를 요구하고, 현재 HEAD에서 다시 빌드한 뒤 에셋·스타일 연결·메타정보·대비 검사를 수행한다. `out/`의 정적 파일만 `.preview/releases/<full-sha>.tar.gz`로 묶는다. SHA-256 파일 목록과 공개 버전 확인용 `deployment.json`을 포함하며, 아카이브 자체의 SHA-256도 출력한다. `.preview/`와 빌드 결과는 Git에서 제외한다.

계정·API 키·DB·브라우저 프로필·앱 실행 파일·SSH 키는 패키지에 넣지 않는다. SSH 개인키는 로컬 파일로만 사용한다.

## 서버 경로

- `/var/www/hongsik-blogworld/releases/<full-sha>`: 변경하지 않는 릴리스 폴더.
- `/var/www/hongsik-blogworld/current`: 현재 릴리스 연결.
- `/var/www/hongsik-blogworld/previous`: 이전 릴리스 연결.
- `/var/lib/hongsik-blogworld/acme`: 인증서 검증 파일.
- `/etc/nginx/sites-available/blogworld.hongsik.blog.conf`: 새 사이트 전용 설정.
- `/var/backups/hongsik-blogworld`: 변경 전 Nginx 설정 백업. 서버 내부에만 보관한다.

## 최초 설치

1. Namecheap A 레코드 `blogworld`가 배포 서버를 가리키는지 확인한다.
2. 기존 WordPress의 HTTPS 상태·최종 주소·페이지 제목과 `nginx -t` 결과를 기록한다.
3. Nginx 설정을 서버의 접근 제한된 백업 폴더에 보관한다.
4. 릴리스 아카이브·SHA-256 파일·`deploy/release.sh`·Nginx 설정을 서버의 임시 배포 폴더에 전송한다.
5. 아카이브의 SHA-256을 확인한 다음 `sudo bash release.sh <archive> <full-sha>`를 실행한다. 스크립트는 파일 목록 검증 후 현재 연결을 원자적으로 바꾼다. 이전 릴리스는 삭제하지 않는다.
6. `deploy/nginx/blogworld-http.conf`를 새 사이트 설정으로 설치하고 `nginx -t` 통과 후 reload한다. Host 헤더를 지정한 HTTP 검사와 ACME 파일 외부 접근을 확인한다.
7. 인증서가 없을 때 webroot 방식으로 발급한다. 기존 WordPress 인증서는 교체하지 않는다.

```bash
sudo certbot certonly --webroot \
  --webroot-path /var/lib/hongsik-blogworld/acme \
  --domain blogworld.hongsik.blog \
  --cert-name blogworld.hongsik.blog --non-interactive
```

8. 인증서 발급 후 `deploy/nginx/blogworld.conf`를 설치하고 `nginx -t` 통과 후 reload한다.
9. 해당 인증서 갱신 성공 후 `nginx -t`와 reload를 수행하는 전용 `deploy/renew-hook.sh`를 설치한다. 기존 갱신 설정은 유지한다.

위 명령은 서버에 이미 등록된 ACME 계정을 재사용한다. 기존 계정 연락처를 바꾸거나 새 계정을 자동 등록하지 않는다. 등록 계정이 없으면 먼저 계정 설정을 확인한다.

## 검증과 재배포

- HTTP→HTTPS 리다이렉트, 도메인에 맞는 유효 인증서, 메인 HTML·CSS·이미지·폰트·아이콘·robots·sitemap·출처 문서의 정상 응답을 확인한다.
- 공개 `deployment.json`의 커밋과 배포한 릴리스가 같은지 확인한다.
- 없는 주소는 404여야 한다. HTML은 재검증하도록, 해시된 Next 정적 자산은 immutable로 제공한다. 압축·캐시·MIME을 확인한다.
- 기존 WordPress의 HTTPS 응답·최종 주소·제목이 배포 전과 같은지 확인한다.
- 재배포는 새 커밋을 패키징해 같은 릴리스 스크립트로 설치한다. Nginx 설정이 바뀌지 않으면 reload가 필요하지 않다.
- 돌아가려면 `current.next`를 검증된 이전 릴리스로 연결하고 `mv -Tf current.next current`로 바꾼 뒤 공개 버전을 확인한다. 릴리스 폴더는 삭제하지 않는다.

이 문서는 실행 절차다. 실제 배포 결과·주소·커밋·검증 한계는 `verification-stage-6.md`에 별도로 기록한다. 브라우저 화면 검수와 Lighthouse를 실행하지 못했으면 통과 점수를 적지 않는다.
