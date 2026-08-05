<script setup>
import { useRouter } from 'vue-router'
import { House, WarningFilled } from '@element-plus/icons-vue'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>

<template>
  <main class="not-found-page">
    <el-card class="not-found-panel" shadow="never">
      <el-result
        title="페이지를 찾을 수 없습니다"
        sub-title="입력한 주소가 올바른지 확인하거나 메인 대시보드로 돌아가 주세요."
      >
        <template #icon>
          <div class="error-symbol">
            <el-icon><WarningFilled /></el-icon>
          </div>
          <p class="error-code">ERROR 404</p>
        </template>
        <template #extra>
          <el-button type="primary" size="large" :icon="House" @click="handleGoHome">
            날씨 대시보드로 이동
          </el-button>
        </template>
      </el-result>
    </el-card>
  </main>
</template>

<style scoped>
.not-found-page {
  display: grid;
  place-items: center;
  width: 100%;
  max-width: var(--content-width);
  min-height: clamp(25rem, 62vh, 38rem);
  margin: 2rem auto 0;
}

.not-found-panel {
  position: relative;
  width: min(100%, 38rem);
  border-color: rgb(255 255 255 / 30%);
  border-radius: 1.35rem;
  background-image: url('../assets/weather/clear-night-stars-v3.jpg');
  background-position: 42% 50%;
  background-size: cover;
  box-shadow: 0 1.5rem 3.5rem rgb(4 22 48 / 28%);
  overflow: hidden;
  isolation: isolate;
  animation: night-sky-drift 48s ease-in-out infinite alternate;
}

.not-found-panel::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(2 14 38 / 34%);
  content: '';
}

.not-found-panel :deep(.el-card__body) {
  padding: clamp(1rem, 4vw, 2rem);
}

.not-found-panel :deep(.el-result) {
  padding: clamp(1.5rem, 5vw, 3rem) 1rem;
}

.not-found-panel :deep(.el-result__title p) {
  color: #fff;
  font-size: clamp(1.35rem, 4vw, 1.75rem);
  font-weight: 750;
  letter-spacing: -0.025em;
}

.not-found-panel :deep(.el-result__subtitle p) {
  max-width: 28rem;
  color: rgb(255 255 255 / 76%);
  line-height: 1.7;
}

.error-symbol {
  display: grid;
  place-items: center;
  width: 5rem;
  height: 5rem;
  margin: 0 auto 0.8rem;
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 1.5rem;
  background: rgb(255 255 255 / 14%);
  color: #fff;
  font-size: 2.5rem;
  transform: rotate(-4deg);
}

.error-code {
  color: rgb(255 255 255 / 72%);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}

.not-found-panel .el-button {
  min-width: 13rem;
  border-color: rgb(255 255 255 / 42%);
  background: rgb(255 255 255 / 18%);
  color: #fff;
  font-weight: 650;
  backdrop-filter: blur(10px);
}

.not-found-panel .el-button:hover {
  border-color: #fff;
  background: rgb(255 255 255 / 28%);
  color: #fff;
}

@keyframes night-sky-drift {
  from {
    background-position: 38% 50%;
  }

  to {
    background-position: 58% 50%;
  }
}

@media (max-width: 30rem) {
  .not-found-panel .el-button {
    width: 100%;
    min-width: 0;
  }
}
</style>
