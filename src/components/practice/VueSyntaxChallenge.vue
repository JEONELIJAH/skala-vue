<script setup>
import { computed, ref } from 'vue'

const count = ref(1)
const studentName = ref('전우진')
const plainText = ref('안녕하세요! <strong>Skala-Vue</strong> 강의입니다.')
const message = ref('')
const untrustedHtml = ref('<img src="x" onerror="window.location.href=\'https://google.com\'" />')
const isHighlighted = ref(true)
const accentColor = ref('#9ee6ff')
const temperatureMode = ref('mild')
const showNotice = ref(true)
const memoVersion = ref(0)

function showMessage() {
  message.value = untrustedHtml.value
}

const fruits = ref([
  { id: 'fruit-apple', name: '사과' },
  { id: 'fruit-banana', name: '바나나' },
  { id: 'fruit-orange', name: '오렌지' },
])

const buttonAttrs = {
  type: 'button',
  title: 'v-bind 객체 문법으로 여러 속성을 한 번에 전달했습니다.',
}

const styleObject = computed(() => ({
  borderColor: accentColor.value,
  color: accentColor.value,
}))
</script>

<template>
  <div class="syntax-grid">
    <section class="demo-card demo-card--wide">
      <div class="demo-card__title">
        <span>01</span>
        <div>
          <h3>Reactivity와 Text Interpolation</h3>
          <p>ref 값이 변하면 보간법으로 출력된 화면도 즉시 갱신됩니다.</p>
        </div>
      </div>

      <div class="inline-controls">
        <el-input v-model.trim="studentName" placeholder="이름" />
        <el-button type="primary" @click="count++">숫자 증가</el-button>
      </div>

      <!-- interpolation을 사용하여 ref 값과 계산식을 화면에 출력합니다. -->
      <div class="result-strip">
        {{ studentName || '이름 없음' }}님의 값은 {{ count }}이고, 두 배는 {{ count * 2 }}입니다.
      </div>
    </section>

    <section class="demo-card">
      <div class="demo-card__title">
        <span>02</span>
        <div>
          <h3>v-html과 v-text</h3>
          <p>HTML 렌더링과 안전한 문자열 출력을 비교합니다.</p>
        </div>
      </div>

      <!-- v-html -->
      <p class="html-result" v-html="plainText"></p>
      <!-- v-text -->
      <p class="text-result" v-text="plainText"></p>
      <el-input v-model="untrustedHtml" placeholder="내용을 입력하세요" />
      <el-button @click="showMessage">v-html로 렌더링</el-button>
      <div v-html="message"></div>
    </section>

    <section class="demo-card">
      <div class="demo-card__title">
        <span>03</span>
        <div>
          <h3>v-bind</h3>
          <p>속성, class와 style을 반응형 값에 연결합니다.</p>
        </div>
      </div>

      <button
        v-bind="buttonAttrs"
        class="binding-card"
        :class="{ 'binding-card--active': isHighlighted }"
        :style="styleObject"
        @click="isHighlighted = !isHighlighted"
      >
        class 객체 바인딩 전환
      </button>

      <label class="color-control">
        강조 색상
        <input v-model="accentColor" type="color" />
      </label>
    </section>

    <section class="demo-card">
      <div class="demo-card__title">
        <span>04</span>
        <div>
          <h3>v-if와 v-show</h3>
          <p>DOM 생성 여부와 CSS 표시 여부를 비교합니다.</p>
        </div>
      </div>

      <el-segmented v-model="temperatureMode" :options="['hot', 'mild', 'cold']" />
      <p v-if="temperatureMode === 'hot'" class="condition condition--hot">더운 날입니다.</p>
      <p v-else-if="temperatureMode === 'mild'" class="condition condition--mild">
        선선한 날입니다.
      </p>
      <p v-else class="condition condition--cold">추운 날입니다.</p>

      <el-switch v-model="showNotice" active-text="v-show 표시" />
      <p v-show="showNotice" class="show-notice">이 요소는 DOM에 남고 display만 바뀝니다.</p>
    </section>

    <section class="demo-card">
      <div class="demo-card__title">
        <span>05</span>
        <div>
          <h3>v-for와 key</h3>
          <p>각 항목의 고유 id를 key로 사용합니다.</p>
        </div>
      </div>

      <ul class="fruit-list">
        <li v-for="(fruit, index) in fruits" :key="fruit.id">
          <span>{{ index + 1 }}</span>
          {{ fruit.name }}
        </li>
      </ul>
    </section>

    <section class="demo-card">
      <div class="demo-card__title">
        <span>06</span>
        <div>
          <h3>렌더링 건너뛰기</h3>
          <p>v-pre, v-cloak, v-once와 v-memo의 차이를 관찰합니다.</p>
        </div>
      </div>

      <div class="skip-list">
        <p v-pre>
          <code>v-pre: {{ count }}</code>
        </p>
        <p v-cloak><code>v-cloak: Vue 연결 전 깜빡임 숨김</code></p>
        <p v-once>
          <code>v-once 최초 값: {{ count }}</code>
        </p>
        <p>
          <code>현재 count값: {{ count }}</code>
        </p>
        <!-- v-memo는 의존성 배열이 바뀌지 않으면 렌더링을 건너뜁니다. -->
        <p v-memo="[memoVersion]">
          <code>v-memo 현재 값: {{ count }}</code>
        </p>
      </div>
      <el-button @click="memoVersion++">memo 갱신 허용</el-button>
    </section>
  </div>
</template>

<style scoped>
[v-cloak] {
  display: none;
}

.syntax-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.demo-card {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.demo-card--wide {
  grid-column: 1 / -1;
}

.demo-card__title {
  display: flex;
  gap: 0.7rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.demo-card__title > span {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: var(--glass-accent);
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 800;
}

.demo-card h3 {
  font-size: 0.95rem;
}

.demo-card__title p,
.inline-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.6rem;
}

.result-strip,
.html-result,
.text-result,
.show-notice {
  margin-top: 0.65rem;
  padding: 0.7rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  background: var(--glass-control);
  color: var(--color-text);
  font-size: 0.82rem;
}

.html-result {
  margin-top: 0;
}

.text-result {
  margin-bottom: 0.65rem;
}

.binding-card {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid;
  border-radius: var(--radius-control);
  background: transparent;
  font-weight: 700;
  cursor: pointer;
}

.binding-card--active {
  background: rgb(255 255 255 / 12%);
  box-shadow: inset 0 0 0 1px currentColor;
}

.color-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.65rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.color-control input {
  width: 2.5rem;
  height: 1.75rem;
  padding: 0;
  border: 0;
  background: transparent;
}

.condition {
  margin: 0.75rem 0;
  font-weight: 750;
}

.condition--hot {
  color: #ffd0c9;
}

.condition--mild {
  color: #aef4d7;
}

.condition--cold {
  color: #cbdcff;
}

.fruit-list,
.skip-list {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.fruit-list li,
.skip-list p {
  padding: 0.55rem 0.65rem;
  border-radius: var(--radius-control);
  background: var(--glass-control);
  font-size: 0.8rem;
}

.fruit-list span {
  display: inline-grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  margin-right: 0.35rem;
  border-radius: 50%;
  background: var(--glass-accent);
  font-size: 0.68rem;
}

.skip-list {
  margin-bottom: 0.65rem;
}

@media (max-width: 44rem) {
  .syntax-grid {
    grid-template-columns: 1fr;
  }

  .demo-card--wide {
    grid-column: auto;
  }
}
</style>
