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
// element-plus icons 불러오기
import { InfoFilled, Odometer, PartlyCloudy } from '@element-plus/icons-vue'
import UnitToggler from './components/exercise/UnitToggler.vue'
import clearDay from './assets/weather/clear-day-v2.jpg'
import clearNight from './assets/weather/clear-night-stars-v3.jpg'
import cloudyDay from './assets/weather/cloudy-day-v2.jpg'
import cloudyNight from './assets/weather/cloudy-night-v2.jpg'
// import ModernTask2 from './components/practice/ModernTask2.vue'
// import ModernTask3 from './components/practice/ModernTask3.vue'
// import ModernTask1 from './components/practice/ModernTask1.vue'
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

// ambient 백그라운드 업데이트를 위한 타이머 ID
let ambientTimerId

// ambient 백그라운드 업데이트 함수
const updateAmbientBackground = () => {
  // 현재 시간 가져오기
  const hour = new Date().getHours()

  // 시간대별 테마 설정
  let theme

  // 시간대별 배경 이미지와 색상 설정
  if (hour >= 5 && hour < 9) {
    theme = {
      image: cloudyDay,
      baseColor: '#6a9bc6',
      overlay: 'rgb(76 135 188 / 68%)',
    }
  } else if (hour >= 9 && hour < 17) {
    theme = {
      image: clearDay,
      baseColor: '#417fbd',
      overlay: 'rgb(65 127 189 / 76%)',
    }
  } else if (hour >= 17 && hour < 20) {
    theme = {
      image: cloudyNight,
      baseColor: '#3a75aa',
      overlay: 'rgb(55 112 167 / 64%)',
    }
  } else {
    theme = {
      image: clearNight,
      baseColor: '#315f91',
      overlay: 'rgb(39 86 134 / 62%)',
    }
  }

  // CSS 변수 업데이트
  const rootStyle = document.documentElement.style
  rootStyle.setProperty('--app-sky-image', `url("${theme.image}")`)
  rootStyle.setProperty('--color-background', theme.baseColor)
  rootStyle.setProperty('--app-sky-overlay', theme.overlay)
}

onBeforeMount(() => log('onBeforeMount'))
onMounted(() => {
  log('onMounted')
  // 초기 ambient 백그라운드 업데이트
  updateAmbientBackground()
  // 1분마다 ambient 백그라운드 업데이트
  ambientTimerId = window.setInterval(updateAmbientBackground, 60_000)
})
onBeforeUpdate(() => log('onBeforeUpdate'))
onUpdated(() => log('onUpdated'))
onBeforeUnmount(() => log('onBeforeUnmount'))
onUnmounted(() => {
  log('onUnmounted')
  // ambient 백그라운드 업데이트 타이머 해제
  window.clearInterval(ambientTimerId)

  // CSS 변수 초기화
  const rootStyle = document.documentElement.style
  rootStyle.removeProperty('--app-sky-image')
  rootStyle.removeProperty('--color-background')
  rootStyle.removeProperty('--app-sky-overlay')
})
</script>

<template>
  <header class="header">
    <div class="brand">
      <span class="brand__mark">
        <el-icon><PartlyCloudy /></el-icon>
      </span>
      <div>
        <p class="brand__eyebrow">TODAY'S WEATHER</p>
        <h1>전우진의 날씨 정보</h1>
      </div>
    </div>

    <div class="navigation-bar">
      <nav class="navigation-menu">
        <!-- v-slot으로 href, isExactActive, navigate를 가져옵니다. -->
        <RouterLink
          v-slot="{ href, isExactActive, navigate }"
          custom
          :to="{ name: 'weather-home' }"
        >
          <!-- isExactActive를 사용하여 현재 경로와 일치하는지 확인합니다. -->
          <!-- navigate 함수 내부에서 preventDefault()를 호출하기 때문에, a 태그를 사용해도 새로고침이 발생하지 않습니다. -->
          <a
            class="navigation"
            :class="{ 'navigation--active': isExactActive }"
            :href="href"
            @click="navigate"
          >
            <el-icon><Odometer /></el-icon>
            <span>날씨 대시보드</span>
          </a>
        </RouterLink>
        <RouterLink
          v-slot="{ href, isExactActive, navigate }"
          custom
          :to="{ name: 'weather-about' }"
        >
          <a
            class="navigation"
            :class="{ 'navigation--active': isExactActive }"
            :href="href"
            @click="navigate"
          >
            <el-icon><InfoFilled /></el-icon>
            <span>서비스 소개</span>
          </a>
        </RouterLink>
      </nav>
      <!-- 기온 단위를 전환해주는 UnitToggler를 헤더 오른쪽에 배치합니다. -->
      <UnitToggler />
    </div>
  </header>
  <!-- RouterView를 사용하여 라우트에 따라 다른 컴포넌트를 렌더링합니다. -->
  <RouterView />
</template>

<style scoped>
.header {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: clamp(0.85rem, 2.5vw, 1.25rem);
  border: 1px solid var(--glass-border);
  border-radius: 1.25rem;
  background: var(--glass-surface-strong);
  box-shadow:
    var(--shadow-raised),
    inset 0 1px 0 rgb(255 255 255 / 8%);
  backdrop-filter: var(--glass-filter);
  -webkit-backdrop-filter: var(--glass-filter);
}

.brand {
  display: flex;
  gap: 0.875rem;
  align-items: center;
  padding: 0.25rem 0.25rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.brand__mark {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 3rem;
  height: 3rem;
  border: 1px solid var(--glass-border);
  border-radius: 0.875rem;
  background: var(--glass-accent);
  color: var(--color-primary);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 10%);
  font-size: 1.65rem;
}

.brand__eyebrow {
  margin-bottom: 0.15rem;
  color: var(--color-primary);
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.brand h1 {
  margin: 0;
  font-size: clamp(1.45rem, 4vw, 1.9rem);
  font-weight: 750;
  letter-spacing: -0.025em;
}

.navigation-bar {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.75rem;
  padding: 0.25rem 0 0;
  border: 0;
  background: transparent;
  box-shadow: none;
}

.navigation-menu {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.25rem;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  background: var(--glass-control);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 42%);
}

.navigation {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  min-width: 9rem;
  height: 2.5rem;
  padding: 0 0.9rem;
  border-radius: 999px;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 650;
  transition:
    color var(--transition-fast),
    background-color var(--transition-fast);
}

.navigation:hover {
  background: var(--glass-accent);
  color: var(--color-primary-hover);
}

.navigation--active {
  background: rgb(255 255 255 / 90%);
  color: #2c6fa8;
  box-shadow: 0 0.35rem 0.8rem rgb(23 111 159 / 20%);
}

.navigation--active:hover {
  background: #fff;
  color: #245d8d;
}

.navigation-bar :deep(.unit-toggler) {
  margin-left: auto;
}

@media (max-width: 40rem) {
  .navigation-bar {
    flex-wrap: wrap;
  }

  .navigation-menu {
    width: 100%;
  }

  .navigation {
    flex: 1;
    min-width: 0;
  }

  .navigation-bar :deep(.unit-toggler) {
    justify-content: flex-end;
    width: 100%;
    margin-left: 0;
    padding: 0.35rem 0.25rem 0;
  }
}
</style>
