<script setup>
import { ref } from 'vue'

const clickCount = ref(0)
const parentCount = ref(0)
const onceCount = ref(0)
const eventSummary = ref('아직 이벤트를 확인하지 않았습니다.')
const submitMessage = ref('')
const keyMessage = ref('')
const eventLogs = ref([])

const addLog = (message) => {
  eventLogs.value = [message, ...eventLogs.value].slice(0, 5)
}

const inspectEvent = (event) => {
  eventSummary.value = `target: ${event.target.tagName} / currentTarget: ${event.currentTarget.tagName}`
}

const handleParentClick = (zone) => {
  parentCount.value++
  addLog(`${zone} 부모 영역까지 클릭이 전파되었습니다.`)
}

const handleChildClick = (zone) => {
  addLog(`${zone} 자식 버튼이 실행되었습니다.`)
}

const handleSubmit = () => {
  submitMessage.value = '새로고침 없이 제출 이벤트를 처리했습니다.'
}
</script>

<template>
  <div class="event-layout">
    <section class="event-card">
      <h3>v-on Event Handler</h3>
      <p>인라인 표현식과 메서드 핸들러를 비교합니다.</p>
      <div class="control-row">
        <!-- v-on 인라인으로 클릭 횟수를 증가시킵니다. -->
        <el-button type="primary" @click="clickCount++">인라인 증가</el-button>
        <el-button @click="clickCount = 0">초기화</el-button>
      </div>
      <strong class="metric">{{ clickCount }}회</strong>
    </section>

    <section class="event-card">
      <h3>Event Object</h3>
      <p>클릭이 시작된 요소와 핸들러가 연결된 요소를 확인합니다.</p>
      <button class="target-button" type="button" @click="inspectEvent">
        <span>안쪽 span 클릭</span>
      </button>
      <code>{{ eventSummary }}</code>
    </section>

    <section class="event-card event-card--wide">
      <h3>Event Modifier: .stop</h3>
      <p>첫 번째 버튼은 부모까지 전파되고, 두 번째 버튼은 자신의 이벤트에서 멈춥니다.</p>

      <div class="bubble-grid">
        <!-- .stop이 없으면 bubble-zone까지 클릭이 전파됩니다. -->
        <div class="bubble-zone" @click="handleParentClick('.stop 없음')">
          <span>.stop 없음</span>
          <el-button @click="handleChildClick('.stop 없음')">자식 버튼</el-button>
        </div>

        <!-- .stop이 있으면 bubble-zone까지 클릭이 전파되지 않습니다. -->
        <div class="bubble-zone" @click="handleParentClick('.stop 있음')">
          <span>.stop 있음</span>
          <el-button @click.stop="handleChildClick('.stop 있음')">자식 버튼</el-button>
        </div>
      </div>

      <p class="parent-count">부모 핸들러 실행: {{ parentCount }}회</p>
      <ul class="event-log">
        <li v-for="(message, index) in eventLogs" :key="`${message}-${index}`">{{ message }}</li>
      </ul>
    </section>

    <section class="event-card">
      <h3>.prevent와 .once</h3>
      <!-- .prevent는 폼 제출의 기본 동작을 막습니다. -->
      <form @submit.prevent="handleSubmit">
        <el-button native-type="submit">기본 제출 막기</el-button>
      </form>
      <!-- .once는 클릭 이벤트를 한 번만 실행합니다. -->
      <el-button @click.once="onceCount++">한 번만 실행</el-button>
      <p>{{ submitMessage || '제출 이벤트를 기다리고 있습니다.' }}</p>
      <p>.once 실행 횟수: {{ onceCount }}</p>
    </section>

    <section class="event-card">
      <h3>키보드 Modifier</h3>
      <p>Enter 키가 들어왔을 때만 핸들러를 실행합니다.</p>
      <el-input
        v-model="keyMessage"
        placeholder="메시지를 쓰고 Enter"
        @keyup.enter="addLog(`Enter 입력: ${keyMessage || '빈 값'}`)"
      />
    </section>
  </div>
</template>

<style scoped>
.event-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.event-card {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.event-card--wide {
  grid-column: 1 / -1;
}

.event-card h3 {
  font-size: 0.95rem;
}

.event-card > p {
  margin: 0.2rem 0 0.8rem;
  color: var(--color-text-muted);
  font-size: 0.77rem;
}

.control-row,
.event-card form {
  display: inline-flex;
  gap: 0.5rem;
  margin-right: 0.5rem;
}

.metric {
  display: block;
  margin-top: 1rem;
  font-size: 1.8rem;
}

.target-button {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-control);
  background: var(--glass-control);
  color: var(--color-heading);
  cursor: pointer;
}

.event-card code {
  display: block;
  margin-top: 0.65rem;
  color: var(--color-primary);
  font-size: 0.75rem;
}

.bubble-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.7rem;
}

.bubble-zone {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  min-height: 5rem;
  padding: 0.85rem;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-control);
  background: var(--glass-control);
  font-size: 0.8rem;
  font-weight: 700;
}

.parent-count {
  margin-bottom: 0.4rem !important;
}

.event-log {
  display: grid;
  gap: 0.3rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.event-log li {
  padding: 0.4rem 0.55rem;
  border-radius: 0.45rem;
  background: rgb(255 255 255 / 8%);
  color: var(--color-text-muted);
  font-size: 0.72rem;
}

@media (max-width: 44rem) {
  .event-layout,
  .bubble-grid {
    grid-template-columns: 1fr;
  }

  .event-card--wide {
    grid-column: auto;
  }
}
</style>
