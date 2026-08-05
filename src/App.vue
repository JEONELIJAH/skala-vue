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
import DownloadForm from './components/practice/DownloadForm.vue'
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
      <h1>🌤️ 전우진의 날씨 정보 </h1>
      <nav class="navigation-menu">
        <RouterLink class="navigation" :to="{ name: 'weather-home' }">⛅ 날씨 대시보드</RouterLink>
        <RouterLink class="navigation" :to="{ name: 'weather-about' }">ℹ️ 서비스 소개</RouterLink>
        <UnitToggler />
      </nav>
    </header>
  <RouterView />
  <DownloadForm />
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: none;
  margin-top: 5rem;
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
  gap: 1rem;
  width: 100%;
  max-width: 60rem;
}

.navigation {
  flex: 1;
  min-height: 2.75rem;
  padding: 0.85rem 1rem;
  gap: 0.75rem;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 0.6rem;
  background: var(--color-background-soft);
  color: var(--color-text);
  font: inherit;
  cursor: pointer;
}

.navigation:hover {
  border-color: var(--color-border-hover);
  background: var(--color-background-mute);
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  nav {
    text-align: center;
    font-size: 1rem;
    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
