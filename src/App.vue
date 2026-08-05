<script setup>
import { RouterLink, RouterView } from 'vue-router'
import {
  onMounted,
  onUnmounted,
  onUpdated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
} from 'vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
// import DownloadForm from './components/practice/DownloadForm.vue'
// import RateForm from './components/practice/RateForm.vue'
// import UserForm from './components/practice/UserForm.vue'
// import HelloWorld from './components/HelloWorld.vue'
// import LifeCycleHookParent from './components/practice/LifeCycleHookParent.vue'
// import SlotParent from './components/practice/SlotParent.vue'
// import WeatherHomeView from '/views/WeatherHomeView.vue/index.js'
// import StoreCounter from './components/practice/library/StoreCounter.vue'

const log = (hook) => {
  console.log(`[App] ${hook}`)
}

onBeforeMount(() => log('onBeforeMount'))
onMounted(() => log('onMounted'))
onBeforeUpdate(() => log('onBeforeUpdate'))
onUpdated(() => log('onUpdated'))
onBeforeUnmount(() => log('onBeforeUnmount'))
onUnmounted(() => log('onUnmounted'))
</script>

<template>
  <header class="header">
    <h1>🌤️ 전우진의 날씨 정보</h1>
    <nav class="navigation-menu" aria-label="주요 메뉴">
      <RouterLink v-slot="{ isExactActive, navigate }" custom :to="{ name: 'weather-home' }">
        <el-button
          class="navigation"
          :class="{ 'navigation--active': isExactActive }"
          @click="navigate"
        >
          ⛅ 날씨 대시보드
        </el-button>
      </RouterLink>
      <RouterLink v-slot="{ isExactActive, navigate }" custom :to="{ name: 'weather-about' }">
        <el-button
          class="navigation"
          :class="{ 'navigation--active': isExactActive }"
          @click="navigate"
        >
          ℹ️ 서비스 소개
        </el-button>
      </RouterLink>
      <UnitToggler />
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: none;
  margin-top: clamp(2.5rem, 8vh, 5rem);
}

.header h1 {
  width: 100%;
  max-width: 60rem;
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
}

.navigation-menu {
  display: flex;
  gap: 0.625rem;
  align-items: center;
  width: 100%;
  max-width: 60rem;
  margin-top: 1rem;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-background-soft);
  box-shadow: 0 0.4rem 1rem rgb(0 0 0 / 12%);
}

.navigation {
  flex: 0 1 13rem;
  height: 2.75rem;
  border-radius: 0.55rem;
  font-weight: 700;
  --el-button-bg-color: transparent;
  --el-button-border-color: transparent;
  --el-button-text-color: var(--color-text);
  --el-button-hover-bg-color: rgb(66 184 131 / 12%);
  --el-button-hover-border-color: rgb(66 184 131 / 45%);
  --el-button-hover-text-color: #61dba7;
  --el-button-active-bg-color: rgb(66 184 131 / 20%);
  --el-button-active-border-color: #42b883;
  --el-button-active-text-color: #8ff0c5;
}

.navigation--active {
  --el-button-bg-color: rgb(66 184 131 / 18%);
  --el-button-border-color: #42b883;
  --el-button-text-color: #8ff0c5;
  --el-button-hover-bg-color: rgb(66 184 131 / 26%);
  --el-button-hover-border-color: #61dba7;
  --el-button-hover-text-color: #b8f7d8;
  box-shadow: inset 0 0 0 1px rgb(66 184 131 / 12%);
}

.navigation-menu :deep(.unit-toggler) {
  padding: 0 0.5rem;
  color: var(--color-text);
}

@media (max-width: 40rem) {
  .navigation-menu {
    flex-wrap: wrap;
  }

  .navigation {
    flex: 1 1 calc(50% - 0.313rem);
  }

  .navigation-menu :deep(.unit-toggler) {
    justify-content: flex-end;
    width: 100%;
    margin-left: 0;
    padding-top: 0.5rem;
    border-top: 1px solid var(--color-border);
  }
}
</style>
