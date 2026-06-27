# 경민의 반칠순 생존기록소

서른다섯 살을 칠순의 절반, 즉 **반칠순**으로 우겨서 축하하는 모바일 우선 방명록입니다. 동네 잔치 포스터, 예능 자막, 사진관 소품의 질감을 섞어 지나치게 반듯한 템플릿 느낌을 피했습니다.

## 들어 있는 것

- 모바일/데스크톱 반응형 초대장
- 관계와 표정을 고르는 방명록
- 한국식 주접 문구 랜덤 생성
- 방명록 필터와 공감 버튼
- 반칠순력 측정기와 수동 축포
- 기기별 로컬 저장 기본 제공
- Supabase 연결 시 모든 방문자가 함께 보는 공용 방명록
- GitHub Pages 자동 배포 워크플로

## 기본 정보 바꾸기

[`config.js`](./config.js)만 수정하면 됩니다.

```js
window.SITE_CONFIG = {
  HOST_NAME: "경민",
  AGE: 35,
  EVENT_YEAR: 2026,
  EVENT_DATE: "2026.07.03",
  EVENT_PLACE: "경민이의 마음속 VIP석",
  KAKAO_GIFT_URL: "https://gift.kakao.com/...",
  PHONE_NUMBER: "010-0000-0000",
  SUPABASE_URL: "",
  SUPABASE_ANON_KEY: "",
};
```

날짜와 장소를 비워두면 개그 문구가 대신 표시됩니다.

## 로컬에서 보기

별도 빌드가 없는 정적 사이트입니다. `index.html`을 정적 서버로 열면 됩니다.

```powershell
python -m http.server 4173
```

그다음 `http://127.0.0.1:4173`에 접속합니다.

## 공용 방명록 연결하기

현재 기본값은 방문자 브라우저의 `localStorage`에 저장됩니다. 실제 행사에서 모든 사람이 같은 글을 보게 하려면 Supabase 무료 프로젝트를 하나 연결하세요.

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 [`supabase.sql`](./supabase.sql)을 실행합니다.
3. Project Settings → API에서 Project URL과 anon/publishable key를 복사합니다.
4. `config.js`의 `SUPABASE_URL`, `SUPABASE_ANON_KEY`에 넣습니다.

`service_role` 키는 절대 넣지 마세요. 이 사이트에는 브라우저 공개용 anon/publishable key만 사용합니다.

공용 방명록은 익명 읽기/쓰기만 허용하고 수정/삭제는 막아 둡니다. 공개 행사 링크라면 Supabase 대시보드에서 CAPTCHA 또는 추가 스팸 방지 정책을 설정하는 것도 권장합니다.

## GitHub Pages 배포

`main` 브랜치에 푸시하면 [`.github/workflows/pages.yml`](./.github/workflows/pages.yml)이 자동으로 배포합니다.

처음 한 번은 GitHub 저장소의 Settings → Pages → Build and deployment → Source를 **GitHub Actions**로 설정해야 할 수 있습니다.

## 파일 구조

```text
.
├─ index.html
├─ styles.css
├─ script.js
├─ config.js
├─ supabase.sql
└─ .github/workflows/pages.yml
```

## 개인정보 메모

방명록에는 전화번호, 주소, 계좌번호처럼 민감한 정보를 적지 않는 편이 안전합니다. 이름 대신 별명을 받아도 충분히 재미있게 작동하도록 만들었습니다.
