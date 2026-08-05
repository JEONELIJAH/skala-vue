<script setup>
import { computed, reactive, ref, watch, watchEffect } from 'vue'

const count = ref(0)
const searchKeyword = ref('')
const profile = reactive({
  name: 'Vue Learner',
  level: 1,
  online: true,
})
const preferences = ref({
  display: {
    density: 'comfortable',
  },
})
const watcherLogs = ref([])
const effectMessage = ref('')

const levelLabel = computed(
  () => `${profile.name} · Lv.${profile.level} · 점수 ${count.value * 10}`,
)

const record = (type, message) => {
  watcherLogs.value = [
    { id: `${Date.now()}-${Math.random()}`, type, message },
    ...watcherLogs.value,
  ].slice(0, 8)
}

watch(count, (newValue, oldValue) => {
  record('watch(ref)', `${oldValue} → ${newValue}`)
})

watch([count, () => profile.level], ([newCount, newLevel], [oldCount, oldLevel]) => {
  record('multi-source', `점수 ${oldCount}→${newCount}, 레벨 ${oldLevel}→${newLevel}`)
})

watch(
  preferences,
  (newValue) => {
    record('deep watch', `화면 밀도: ${newValue.display.density}`)
  },
  { deep: true },
)

watch(profile, (newProfile) => {
  record('watch(reactive)', `${newProfile.name}의 상태가 변경됨`)
})

watchEffect(() => {
  effectMessage.value = `watchEffect가 계산한 검색어 길이: ${searchKeyword.value.length}`
})
</script>

<template>
  <div class="composition-layout">
    <section class="state-panel">
      <header>
        <span>Reactive State</span>
        <h3>ref와 reactive</h3>
      </header>

      <div class="state-grid">
        <article>
          <small>ref()</small>
          <strong>{{ count }}</strong>
          <el-button-group>
            <el-button @click="count--">−</el-button>
            <el-button @click="count++">+</el-button>
          </el-button-group>
        </article>

        <article>
          <small>reactive()</small>
          <strong>Lv.{{ profile.level }}</strong>
          <el-button @click="profile.level++">레벨 증가</el-button>
        </article>
      </div>

      <div class="computed-result">
        <small>computed() — 의존 값이 바뀔 때만 다시 계산</small>
        <strong>{{ levelLabel }}</strong>
      </div>

      <div class="watch-controls">
        <el-input v-model="profile.name" placeholder="reactive 이름" />
        <el-input v-model="searchKeyword" placeholder="watchEffect 검색어" />
        <el-select v-model="preferences.display.density">
          <el-option label="편안하게" value="comfortable" />
          <el-option label="촘촘하게" value="compact" />
        </el-select>
      </div>
    </section>

    <section class="watch-panel">
      <header>
        <span>Computed & Watchers</span>
        <h3>반응 기록</h3>
      </header>

      <div class="watch-kinds">
        <span>watch</span>
        <span>multi-source</span>
        <span>deep</span>
        <span>reactive</span>
        <span>watchEffect</span>
      </div>

      <p class="effect-message">{{ effectMessage }}</p>

      <ol class="watch-log">
        <li v-for="item in watcherLogs" :key="item.id">
          <code>{{ item.type }}</code>
          <span>{{ item.message }}</span>
        </li>
      </ol>
    </section>
  </div>
</template>

<style scoped>
.composition-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(18rem, 0.9fr);
  gap: 0.9rem;
}

.state-panel,
.watch-panel {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.state-panel > header span,
.watch-panel > header span {
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.state-panel h3,
.watch-panel h3 {
  margin-top: 0.15rem;
  font-size: 1rem;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.65rem;
  margin-top: 1rem;
}

.state-grid article {
  display: grid;
  gap: 0.6rem;
  padding: 0.8rem;
  border-radius: var(--radius-control);
  background: var(--glass-control);
}

.state-grid small,
.computed-result small {
  color: var(--color-text-muted);
  font-size: 0.7rem;
}

.state-grid strong {
  font-size: 1.8rem;
}

.computed-result {
  display: grid;
  gap: 0.25rem;
  margin-top: 0.65rem;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  background: rgb(255 255 255 / 8%);
}

.watch-controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  margin-top: 0.65rem;
}

.watch-kinds {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin: 0.8rem 0;
}

.watch-kinds span {
  padding: 0.22rem 0.45rem;
  border-radius: 999px;
  background: var(--glass-accent);
  color: var(--color-text-muted);
  font-size: 0.64rem;
  font-weight: 700;
}

.effect-message {
  margin-bottom: 0.55rem;
  padding: 0.5rem 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 0.45rem;
  color: var(--color-text-muted);
  font-size: 0.7rem;
}

.watch-log {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.watch-log li {
  display: grid;
  grid-template-columns: 6.5rem 1fr;
  gap: 0.45rem;
  align-items: baseline;
  padding: 0.5rem 0.6rem;
  border-radius: 0.45rem;
  background: rgb(2 31 60 / 28%);
  font-size: 0.7rem;
}

.watch-log code {
  color: #9ee6ff;
}

.watch-log span {
  color: var(--color-text-muted);
}

@media (max-width: 52rem) {
  .composition-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 38rem) {
  .state-grid,
  .watch-controls {
    grid-template-columns: 1fr;
  }
}
</style>
