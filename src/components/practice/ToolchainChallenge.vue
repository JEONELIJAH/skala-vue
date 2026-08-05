<script setup>
const currentMode = import.meta.env.MODE
const apiUrl = import.meta.env.VITE_API_URL || '현재 모드에 설정되지 않음'
</script>

<template>
  <div class="tool-grid">
    <section class="tool-card">
      <div class="tool-card__top">
        <span>ESLint</span>
        <strong>설정 완료</strong>
      </div>
      <h3>코드 품질 규칙</h3>
      <p><code>eqeqeq</code>는 엄격한 비교를 강제하고 <code>no-console</code>은 허용합니다.</p>
      <pre><code>eqeqeq: ['error', 'always']
'no-console': 'off'</code></pre>
      <code class="command">npm run lint</code>
    </section>

    <section class="tool-card">
      <div class="tool-card__top">
        <span>Prettier</span>
        <strong>스크립트 등록</strong>
      </div>
      <h3>일관된 포맷</h3>
      <p>불필요한 공백과 세미콜론을 프로젝트 설정에 맞춰 자동 정리합니다.</p>
      <pre><code>const myRegion = `Suwon`
const regionGreeting = `웰컴 투 ${myRegion}`</code></pre>
      <code class="command">npm run format</code>
    </section>

    <section class="tool-card">
      <div class="tool-card__top">
        <span>Vite env</span>
        <strong>{{ currentMode }}</strong>
      </div>
      <h3>환경별 API URL</h3>
      <p><code>.env.staging</code>과 <code>.env.production</code>이 모드에 따라 선택됩니다.</p>
      <dl>
        <div>
          <dt>현재 MODE</dt>
          <dd>{{ currentMode }}</dd>
        </div>
        <div>
          <dt>VITE_API_URL</dt>
          <dd>{{ apiUrl }}</dd>
        </div>
      </dl>
      <code class="command">npm run build:staging</code>
    </section>

    <section class="tool-card">
      <div class="tool-card__top">
        <span>Vite build</span>
        <strong>dist/ 생성</strong>
      </div>
      <h3>배포 완제품</h3>
      <p>Vue SFC와 에셋을 최적화하고 해시가 붙은 파일을 <code>dist/assets</code>에 만듭니다.</p>
      <pre><code>dist/
├── index.html
└── assets/
    ├── index-[hash].js
    └── index-[hash].css</code></pre>
      <code class="command">npm run build</code>
    </section>
  </div>
</template>

<style scoped>
.tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.tool-card {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.tool-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-card__top span {
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tool-card__top strong {
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
  background: rgb(98 230 183 / 18%);
  color: #baf6df;
  font-size: 0.64rem;
}

.tool-card h3 {
  margin-top: 0.65rem;
  font-size: 1rem;
}

.tool-card p {
  min-height: 2.5rem;
  margin: 0.25rem 0 0.7rem;
  color: var(--color-text-muted);
  font-size: 0.76rem;
}

.tool-card pre,
.tool-card dl {
  min-height: 6rem;
  margin: 0 0 0.7rem;
  padding: 0.7rem;
  border-radius: var(--radius-control);
  background: rgb(2 28 55 / 58%);
  color: #c9f1ff;
  font-size: 0.7rem;
  white-space: pre-wrap;
}

.tool-card dl {
  display: grid;
  align-content: center;
  gap: 0.55rem;
}

.tool-card dl div {
  display: grid;
  grid-template-columns: 6rem 1fr;
  gap: 0.5rem;
}

.tool-card dt {
  color: var(--color-text-muted);
}

.tool-card dd {
  min-width: 0;
  margin: 0;
  overflow-wrap: anywhere;
}

.command {
  display: inline-block;
  padding: 0.35rem 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
  color: var(--color-primary);
  font-size: 0.68rem;
}

@media (max-width: 44rem) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
