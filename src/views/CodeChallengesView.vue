<script setup>
import { ref } from 'vue'
import ChallengePanel from '@/components/practice/ChallengePanel.vue'
import VueSyntaxChallenge from '@/components/practice/VueSyntaxChallenge.vue'
import EventHandlingChallenge from '@/components/practice/EventHandlingChallenge.vue'
import FormHandlingChallenge from '@/components/practice/FormHandlingChallenge.vue'
import CompositionApiChallenge from '@/components/practice/CompositionApiChallenge.vue'
import PropsEmitsChallenge from '@/components/practice/PropsEmitsChallenge.vue'
import AxiosJsonChallenge from '@/components/practice/AxiosJsonChallenge.vue'
import ToolchainChallenge from '@/components/practice/ToolchainChallenge.vue'
import LifeCycleHookParent from '@/components/practice/LifeCycleHookParent.vue'
import SlotParent from '@/components/practice/SlotParent.vue'
import StoreCounter from '@/components/practice/library/StoreCounter.vue'
import UserForm from '@/components/practice/UserForm.vue'
import RateForm from '@/components/practice/RateForm.vue'
import DownloadForm from '@/components/practice/DownloadForm.vue'
import ModernTask1 from '@/components/practice/ModernTask1.vue'
import ModernTask2 from '@/components/practice/ModernTask2.vue'
import ModernTask3 from '@/components/practice/ModernTask3.vue'

const activeGroup = ref('syntax')
</script>

<template>
  <main class="challenge-page">
    <section class="challenge-hero">
      <div>
        <span class="challenge-hero__eyebrow">Vue Learning Lab</span>
        <h2>Code Challenge 모음</h2>
      </div>
    </section>

    <el-tabs v-model="activeGroup" class="challenge-tabs">
      <el-tab-pane label="Vue 문법" name="syntax">
        <div class="challenge-stack">
          <ChallengePanel
            title="Vue 문법과 Directive"
            description="반응성, 보간법과 Vue Directive가 DOM을 어떻게 바꾸는지 직접 확인합니다."
            :topics="['Reactivity', 'Interpolation', 'v-html', 'v-bind', 'v-if', 'v-for', 'v-memo']"
          >
            <VueSyntaxChallenge />
          </ChallengePanel>

          <ChallengePanel
            title="Vue Event Handling"
            description="Event 객체와 버블링을 관찰하고 .stop, .prevent, .once Modifier를 비교합니다."
            :topics="['v-on', 'Event Object', '.stop', '.prevent', '.once', '.enter']"
          >
            <EventHandlingChallenge />
          </ChallengePanel>

          <ChallengePanel
            title="Vue Form Handling과 Style"
            description="HTML Form 요소별 v-model 값의 모양과 주요 Modifier를 한 화면에서 확인합니다."
            :topics="[
              'v-model',
              'text',
              'checkbox',
              'radio',
              'select',
              '.trim',
              '.number',
              '.lazy',
            ]"
          >
            <FormHandlingChallenge />
          </ChallengePanel>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Composition API" name="composition" lazy>
        <ChallengePanel
          title="Reactive State, Computed와 Watchers"
          description="ref와 reactive 상태를 바꾸고 각 watcher가 언제 실행되는지 기록으로 확인합니다."
          :topics="['ref', 'reactive', 'computed', 'watch', 'multi-source', 'deep', 'watchEffect']"
        >
          <CompositionApiChallenge />
        </ChallengePanel>
      </el-tab-pane>

      <el-tab-pane label="Component" name="component" lazy>
        <div class="challenge-stack">
          <ChallengePanel
            title="Component Lifecycle"
            description="부모와 자식의 mount, update, unmount 순서를 브라우저 Console에서 확인합니다."
            :topics="['onMounted', 'onUpdated', 'onUnmounted']"
          >
            <div class="embedded-demo"><LifeCycleHookParent /></div>
          </ChallengePanel>

          <ChallengePanel
            title="Props & Emits"
            description="데이터는 props로 내려가고 사용자 행동은 emit 이벤트로 올라오는 흐름을 확인합니다."
            :topics="['defineProps', 'defineEmits', 'Events Up']"
          >
            <PropsEmitsChallenge />
          </ChallengePanel>

          <ChallengePanel
            title="Component Slot"
            description="부모가 자식의 빈 공간에 구조를 전달하는 세 가지 Slot을 비교합니다."
            :topics="['Default Slot', 'Named Slot', 'Scoped Slot']"
          >
            <div class="embedded-demo slot-showcase"><SlotParent /></div>
          </ChallengePanel>
        </div>
      </el-tab-pane>

      <el-tab-pane label="Pinia · Axios" name="data" lazy>
        <div class="challenge-stack">
          <ChallengePanel
            title="Pinia Store"
            description="State, Getter와 Action을 컴포넌트 밖의 Store에서 관리합니다."
            :topics="['defineStore', 'state', 'getters', 'actions', 'Devtools']"
          >
            <div class="embedded-demo"><StoreCounter /></div>
          </ChallengePanel>

          <ChallengePanel
            title="Axios"
            description="실시간 OpenWeather 연동 상태와 일반 JSON GET 요청을 함께 확인합니다."
            :topics="['axios.get', 'async/await', 'OpenWeather', 'JSON']"
          >
            <AxiosJsonChallenge />
          </ChallengePanel>
        </div>
      </el-tab-pane>

      <el-tab-pane label="UI Library" name="ui" lazy>
        <ChallengePanel
          title="Element Plus UI"
          description="Form Validation, 수량·별점, Confirm과 Progress 컴포넌트를 실행합니다."
          :topics="['el-card', 'v-slot', 'el-input', 'el-switch', 'el-button', 'el-progress']"
        >
          <div class="ui-examples">
            <UserForm />
            <RateForm />
            <DownloadForm />
          </div>
        </ChallengePanel>
      </el-tab-pane>

      <el-tab-pane label="Modern JS" name="javascript" lazy>
        <ChallengePanel
          title="Modern JavaScript"
          description="Vue 반응형 결과창을 이용해 배열·객체 가공과 비동기 파이프라인을 실행합니다."
          :topics="['includes', 'destructuring', 'spread', '?.', '??', 'async/await', 'try/catch']"
        >
          <div class="modern-examples embedded-demo">
            <ModernTask1 />
            <ModernTask2 />
            <ModernTask3 />
          </div>
        </ChallengePanel>
      </el-tab-pane>

      <el-tab-pane label="Toolchain" name="toolchain" lazy>
        <ChallengePanel
          title="ESLint, Prettier, env와 Vite Build"
          description="현재 프로젝트에 적용된 개발 도구 설정과 실행 명령을 한 번에 확인합니다."
          :topics="['ESLint', 'Prettier', '.env', 'Vite mode', 'dist']"
        >
          <ToolchainChallenge />
        </ChallengePanel>
      </el-tab-pane>
    </el-tabs>
  </main>
</template>

<style scoped>
.challenge-page {
  width: 100%;
  max-width: var(--content-width);
  margin: 1.25rem auto 2rem;
}

.challenge-hero {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
  justify-content: space-between;
  padding: clamp(1.1rem, 4vw, 1.8rem);
  border: 1px solid var(--glass-border);
  border-radius: 1.25rem;
  background: var(--glass-surface-strong);
  box-shadow: var(--shadow-raised);
  backdrop-filter: var(--glass-filter);
}

.challenge-hero__eyebrow {
  color: var(--color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.challenge-hero h2 {
  margin-top: 0.3rem;
  font-size: clamp(1.55rem, 5vw, 2.25rem);
  letter-spacing: -0.04em;
}

.challenge-hero p {
  max-width: 42rem;
  margin-top: 0.45rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  line-height: 1.7;
}

.challenge-tabs {
  margin-top: 1rem;
}

.challenge-tabs :deep(.el-tabs__header) {
  margin-bottom: 1rem;
  padding: 0.35rem;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-panel);
  background: var(--glass-surface-strong);
  backdrop-filter: var(--glass-filter);
}

.challenge-tabs :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.challenge-tabs :deep(.el-tabs__item) {
  height: 2.6rem;
  padding: 0 0.9rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 700;
}

.challenge-tabs :deep(.el-tabs__item.is-active),
.challenge-tabs :deep(.el-tabs__item:hover) {
  color: var(--color-heading);
}

.challenge-tabs :deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 999px;
  background: var(--color-primary);
}

.challenge-stack,
.ui-examples,
.modern-examples {
  display: grid;
  gap: 1rem;
}

.ui-examples {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.ui-examples > :last-child {
  grid-column: 1 / -1;
}

.modern-examples {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.embedded-demo :deep(main),
.embedded-demo :deep(.practice-section),
.embedded-demo :deep(section),
.embedded-demo :deep(.quiz-container),
.embedded-demo :deep(.card) {
  margin: 0;
}

.embedded-demo :deep(main),
.embedded-demo :deep(.practice-section),
.embedded-demo :deep(.quiz-container > .card),
.modern-examples :deep(section) {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.embedded-demo :deep(h1) {
  font-size: 1.1rem;
}

.embedded-demo :deep(h2),
.embedded-demo :deep(h3) {
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
}

.embedded-demo :deep(p) {
  margin: 0.35rem 0;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.embedded-demo :deep(button:not(.el-button)),
.modern-examples :deep(button:not(.el-button)) {
  min-height: 2.35rem;
  margin: 0.35rem 0.3rem 0.35rem 0;
  padding: 0 0.7rem;
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-control);
  background: var(--glass-control);
  color: var(--color-heading);
  font-weight: 700;
  cursor: pointer;
}

.slot-showcase :deep(.base-card),
.slot-showcase :deep(.card) {
  margin-top: 0.65rem;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  background: var(--glass-control);
}

.modern-examples :deep(.console),
.modern-examples :deep(section > p) {
  margin-top: 0.7rem;
  padding: 0.65rem;
  border-radius: var(--radius-control);
  background: rgb(2 28 55 / 50%);
  color: #c9f1ff;
  font-size: 0.72rem;
}

.ui-examples :deep(.el-card) {
  border-color: var(--color-border);
  background: rgb(7 48 88 / 24%);
}

@media (max-width: 50rem) {
  .challenge-hero {
    align-items: stretch;
    flex-direction: column;
  }

  .challenge-summary {
    width: 100%;
    min-width: 0;
  }

  .modern-examples {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 42rem) {
  .ui-examples {
    grid-template-columns: 1fr;
  }

  .ui-examples > :last-child {
    grid-column: auto;
  }

  .challenge-tabs :deep(.el-tabs__item) {
    padding: 0 0.65rem;
  }
}
</style>
