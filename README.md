# GB EduLaw · 경북교육 업무지원 v0.2.1

교장·교감을 위한 독립 시제품. 교육청 공식 서비스가 아닙니다.

## 원본과의 관계
다운로드 폴더에서 v0.1 ZIP과 index.html을 확보해 비교했습니다. 별도로 받은 HTML은 ZIP 내부 HTML과 SHA-256이 동일합니다. v0.2 화면에 원본의 업무별 참고 법령 링크, 개별 문서 초안, 검색 키워드를 통합한 버전입니다. 원본은 `archive/v0.1/`에 변경 없이 보존했습니다. 비교 상세는 `SOURCE_REVIEW.md`를 참고하세요.

https://github.com/gyo6star8i/gb-raw 는 참고 대상으로만 확인했으며 코드를 복제하거나 해당 저장소를 수정하지 않았습니다.

## 실행
`docs/index.html`을 Chrome 또는 Safari로 엽니다. 같은 폴더의 `app.js`, `data.js`, `style.css`도 함께 있어야 합니다. 별도 설치·API 키가 필요 없습니다.

로컬 웹서버 사용 시 프로젝트 폴더에서:
```sh
python3 -m http.server 8765 --directory docs
```
이후 http://localhost:8765 로 접속합니다. 파일 직접 열기에서는 브라우저 정책에 따라 체크 저장·자동 복사가 제한될 수 있습니다.

## 구현 범위
- 6개 업무: 질병휴직, 명예퇴직, 징계, 학교폭력, 안전사고, 학교운영위원회
- 분류 필터·키워드 검색·검색 결과 없음 안내
- 검토 순서 예시·체크리스트·완료 개수
- 체크 상태 브라우저 저장, 업무별 초기화·전체 삭제
- 고정 문서 초안 편집·복사·TXT 내려받기·인쇄
- 모바일 대응과 키보드 조작용 레이블
- 업무별 참고 법령 바로가기 및 국가법령정보센터·경북교육청 공식 홈페이지 링크

**AI 상담, RAG, 법령 원문/조문 연동, 개정 자동 감지, 교육청 지침 검색, 사용자 계정·서버 저장은 미구현입니다.** 참고 법령 및 공식 홈페이지 링크는 검증된 근거 인용이나 자동연계가 아닙니다. 절차·체크리스트는 공식 검증 전 예시이며 실제 업무의 완전한 처리 절차가 아닙니다.

초안·검색어를 서버로 전송하지 않습니다. 체크 상태만 localStorage에 저장하며 초안은 자동 저장하지 않습니다. 업무 전환·새로고침 전에 필요한 초안을 내려받으세요. 개인정보·실제 사안 문서를 공개 저장소에 넣지 마세요.

## 구조
- `docs/`: GitHub Pages에 공개할 정적 웹앱
- `docs/data.js`: 검토용 업무 데이터와 검색
- `docs/app.js`: 화면 동작
- `docs/style.css`: 반응형·인쇄 스타일
- `tests/search.test.cjs`: 검색 회귀 테스트
- `DEVELOPMENT.md`: 점검 결과와 다음 개발 설계

## 검증
Node.js가 있으면:
```sh
node --test tests/search.test.cjs
node --check docs/app.js
```

## GitHub Pages 배포
새 저장소의 Settings → Pages → Build and deployment에서 **Deploy from a branch**, **main**, **/docs**를 선택하고 Save 합니다. 배포 후 해당 화면의 Visit site에서 주소를 확인합니다.

수정 후에는 프로젝트 폴더에서:
```sh
git add docs README.md DEVELOPMENT.md SOURCE_REVIEW.md tests
git commit -m "Improve workflow guidance"
git push origin main
```
`main`의 `/docs`가 갱신되면 GitHub Pages가 다시 배포합니다. GitHub Pages는 정적 호스팅이므로 향후 AI/API 키는 별도 서버에서 관리해야 합니다.

공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
