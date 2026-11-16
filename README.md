# travi-ds

TRAVI 에서 지금까지 정한 것을 Mantine 9 테마 하나로 옮기고, 아직 정하지 않은 것을 회의에서 하나씩 골라 실제 부품에 입혀 보는 페이지다. 사람이 볼 것은 이 README 와 브라우저에 뜨는 카탈로그 화면 한 장이다.

## 처음 여는 법

1. Node.js 가 있어야 한다. 터미널에 `node -v` 를 쳐서 v20.19 이상 또는 v22.12 이상이 나오면 된다. 없으면 nodejs.org 에서 LTS 를 받아 깐다.
2. 터미널(PowerShell)을 열고 이 폴더로 들어간다.

   ```
   cd C:\PROGRAMMING\2026_2_AUTUMN\DINA\travi-ds
   ```

3. 처음 한 번만 필요한 꾸러미를 받는다. 1분쯤 걸린다.

   ```
   npm install
   ```

4. 화면을 띄운다.

   ```
   npm run dev
   ```

   터미널에 `Local: http://localhost:5173/` 같은 주소가 나온다. 그 주소를 브라우저에 붙여 연다. 5173 을 다른 프로그램이 쓰고 있으면 5174 처럼 다른 번호로 뜨니 터미널에 나온 주소를 그대로 쓴다.
5. 끌 때는 그 터미널에서 Ctrl+C 를 누른다.

아래 명령은 필요할 때 하나씩 따로 친다. 한꺼번에 붙여 넣으면 `npm run dev` 에서 멈춰 뒤의 것은 실행되지 않는다.

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 고치면 바로 반영되는 화면을 띄운다. 평소에는 이것만 쓴다 |
| `npm run build` | 타입 검사를 하고 배포용 파일을 dist 폴더에 만든다 |
| `npm run preview` | build 결과를 http://localhost:4173 에서 본다. build 를 먼저 해야 한다 |
| `npm run lint` | 코드 규칙 검사 |
| `npm run check:tokens` | 색 값이 travi_mock/ds/tokens.css 와 같은지 검사 |

dist/index.html 을 더블클릭으로 열면 흰 화면이다. 반드시 위 명령으로 띄운 주소로 연다.

글꼴 세 가지(Pretendard, Source Serif 4, Geist Mono)는 인터넷에서 받아 온다. 인터넷이 끊겨 있으면 컴퓨터에 있는 다른 글꼴로 보여서 글꼴 후보를 비교할 수 없다.

## 화면 쓰는 법

- 오른쪽 위 `밝게 / 어둡게` 로 화면 밝기를 바꾼다. 고른 값은 브라우저에 남는다.
- 왼쪽(좁은 화면에서는 맨 위)의 `지금 할 일` 이 회의에서 고르는 판이다. 아홉 가지를 하나씩 펼쳐 고르고 `다음` 을 누른다. 고르면 오른쪽 부품이 바로 바뀐다.
- 고른 값은 브라우저와 주소 뒤(`#type=b&size=15` 같은 꼴)에 남는다. 맨 아래 `결과 모아 보기` 에서 결과 글과 주소를 복사해 팀에 보낸다.
- 회의용 페이지 `travi_mock/design-system.html` 과 같은 이름을 쓴다(type, size, radius, density, btn, chips, card). 거기서 복사한 주소의 `#` 뒤 부분을 이 페이지 주소 뒤에 붙이면 같은 선택이 Mantine 부품에 입혀진다. 테두리 진하기(edge)와 색 기본값(palette)은 이 페이지에만 있다.

## 무엇이 확정이고 무엇이 아닌가

화면의 구역마다 배지로 표시했다. 기준은 `SESSION_SYNC_2026-11-03.md` 의 H절 10~12번이고 유준이 직접 답한 것만 확정으로 적었다.

- 확정: 주색 남색, 표기 Coop, 상태 이름 다섯 개, Log in, Join TRAVI, 상단 메뉴 넷, 역할 이름 넷, points(pts), 예시 Coop 두 개, network flow records
- 기본값(확인 전): 회색, 상태색, 분야색의 값과 역할 배정. 제안한 값이고 직접 확정한 적은 없다
- 후보: 글꼴, 글자 크기, 모서리, 간격, 버튼 모양, 테두리 진하기, 칩 색 배정, 카드 모양, Next 냐 Vite 냐

Vite 는 임시 선택이다. Next 로 옮겨도 `src/framework/ui/theme.ts` 는 첫 줄에 `'use client'` 한 줄만 더하면 그대로 쓴다.

## 폴더

- `src/framework/ui` 테마(theme.ts), 후보 값 목록(candidates.ts), TRAVI 전용 부품(StatusChip, DomainChip, CoopCard). 디자인 시스템이 가리키는 곳
- `src/framework/state` 여러 화면이 함께 쓰는 값(zustand). 아직 비어 있다
- `src/framework/util` 순수 함수. 아직 비어 있다
- `src/travi` 카탈로그 화면(Catalog.tsx), 고르는 판(MeetingPanel.tsx), 고를 것 목록(decisions.ts), 고른 값 저장(meetingStore.ts), 예시 데이터(coops.ts)
- `scripts/check-tokens.mjs` 색 값 비교

규칙: framework 는 travi 를 import 하지 않는다. 의존은 travi 에서 framework 쪽으로만 간다.

## 값을 고칠 때

- 색 값은 `travi_mock/ds/tokens.css` 와 `theme.ts` 두 곳에 적혀 있다. 한쪽을 바꾸면 다른 쪽도 고치고 `npm run check:tokens` 로 확인한다. 이 검사는 색 계단과 분야 색만 본다. 역할 배정은 눈으로 맞춘다.
- 후보 가운데 하나로 정해지면 `candidates.ts` 의 `DEFAULT_PICKED` 를 그 값으로 바꾸고, 더 고를 일이 없으면 `decisions.ts` 에서 그 항목을 지운다.

## 남아 있는 것

- 스캐폴드가 만든 `src/App.css`, `src/index.css`, `src/assets/`, `public/icons.svg` 는 어디서도 쓰지 않는다. 지워도 되지만 삭제는 유준이 정한다.
- 이 폴더는 아직 git 저장소가 아니다.
