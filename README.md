# skala-vue

## 울진 날씨 기록

`/uljin`에서 기상청 ASOS 울진 관측소(130)의 시간자료를 조회합니다. 최근 7·14·28일과 직접 선택(최대 31일), 기온·강수량·습도·풍속 그래프, 시간별 기록 및 CSV 다운로드를 제공합니다.

- 로컬: Git에서 제외되는 `.env.local`에 `KMA_API_KEY=발급받은_인증키`를 설정하고 `npm run dev`를 실행합니다.
- Vercel: 프로젝트 Production 환경변수에 **Secret**으로 `KMA_API_KEY`를 등록한 다음 배포합니다. `VITE_` 접두사는 붙이지 않습니다.
- 브라우저는 `/api/uljin-weather?from=YYYY-MM-DD&to=YYYY-MM-DD`만 호출합니다. 인증키는 서버에서 기상청으로 요청할 때만 사용합니다.
- `api/uljin-weather.js`는 Vercel Function이며, 개발 서버도 동일한 `server/kma-weather.js`를 사용합니다. 정적 `vite preview`만으로는 API가 실행되지 않습니다.
- 서버 메모리 캐시(10분), 진행 중 요청 중복 제거 및 Vercel CDN 캐시를 사용합니다. 화면에는 실제 마지막 관측 시각을 표시합니다.
- 일별 통계는 시간별 유효 관측값을 가공한 값이며 공식 일 통계가 아닙니다. 강수 결측은 무강수와 구분하고, 부분 자료·오늘 집계는 화면에 표시합니다.

자료 출처: [기상청 API허브](https://apihub.kma.go.kr/)의 종관기상관측 시간자료(기간 조회).

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
