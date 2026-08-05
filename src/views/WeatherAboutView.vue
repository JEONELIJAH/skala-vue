<script setup>
import { Connection, Link, Refresh } from '@element-plus/icons-vue'

const features = [
  {
    title: '컴포넌트 중심 설계',
    description: '화면을 독립적인 Vue 컴포넌트로 나누어 역할과 책임을 명확하게 관리합니다.',
    icon: Connection,
  },
  {
    title: '부드러운 화면 전환',
    description: 'Vue Router를 활용해 페이지 전체를 새로고침하지 않고 필요한 화면만 전환합니다.',
    icon: Refresh,
  },
  {
    title: '검색 상태 동기화',
    description: 'URL 쿼리 스트링과 검색 상태를 연결해 현재 조건을 주소에 그대로 보존합니다.',
    icon: Link,
  },
]
</script>

<template>
  <main class="about-page">
    <section class="about-hero">
      <div class="about-hero__content">
        <h2>Woojin's Weather Dashboard</h2>
        <p class="about-hero__description">
          전 세계 도시의 실시간 날씨와 현지 시각, 상세한 관측 데이터까지 <br />
          한 화면에서 직관적으로 확인하세요.
        </p>
        <div class="technology-tags">
          <span>Vue 3</span>
          <span>Vue Router</span>
          <span>Pinia</span>
          <span>Axios</span>
          <span>Element Plus</span>
          <span>OpenWeather</span>
        </div>
      </div>
    </section>

    <section class="feature-section">
      <header class="section-heading">
        <h3>필요한 정보만, 한 흐름 안에서</h3>
        <p>이 화면을 구성하는 핵심 방식을 간결하게 정리했습니다.</p>
      </header>

      <div class="feature-grid">
        <article v-for="feature in features" :key="feature.title" class="feature-item">
          <span class="feature-item__icon">
            <el-icon><component :is="feature.icon" /></el-icon>
          </span>
          <div>
            <h4>{{ feature.title }}</h4>
            <p>{{ feature.description }}</p>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  width: 100%;
  max-width: var(--content-width);
  margin: 1.25rem auto 2rem;
}

.about-hero {
  position: relative;
  min-height: clamp(20rem, 48vw, 27rem);
  padding: clamp(1.5rem, 6vw, 3.5rem);
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 1.35rem;
  background-image: url('../assets/weather/clear-day-v2.jpg');
  background-position: 42% 50%;
  background-size: cover;
  box-shadow: 0 1.4rem 3rem rgb(5 45 82 / 20%);
  overflow: hidden;
  isolation: isolate;
  animation: about-sky-drift 52s ease-in-out infinite alternate;
}

.about-hero::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(4 54 96 / 38%);
  content: '';
}

.about-hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-end;
  min-height: clamp(17rem, 38vw, 21rem);
  color: #fff;
  text-shadow: 0 2px 12px rgb(0 32 64 / 35%);
}

.about-hero__label {
  color: rgb(255 255 255 / 80%);
  font-size: 0.75rem;
  font-weight: 750;
}

.about-hero h2 {
  margin-top: 0.2rem;
  color: #fff;
  font-size: clamp(2.3rem, 8vw, 4.2rem);
  font-weight: 650;
  letter-spacing: -0.055em;
}

.about-hero__description {
  max-width: 36rem;
  margin-top: 0.75rem;
  color: rgb(255 255 255 / 88%);
  font-size: clamp(0.92rem, 2vw, 1.05rem);
  line-height: 1.75;
}

.technology-tags {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
}

.technology-tags span {
  padding: 0.38rem 0.7rem;
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 999px;
  background: rgb(255 255 255 / 14%);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  backdrop-filter: blur(10px);
}

.feature-section {
  margin-top: 1rem;
  padding: clamp(1.25rem, 4vw, 2rem);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-surface-raised);
  box-shadow: var(--shadow-card);
  backdrop-filter: var(--glass-filter);
  -webkit-backdrop-filter: var(--glass-filter);
}

.section-heading {
  margin-bottom: 1.2rem;
}

.section-heading h3 {
  font-size: clamp(1.15rem, 3vw, 1.4rem);
  letter-spacing: -0.025em;
}

.section-heading p {
  margin-top: 0.35rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.feature-item {
  display: grid;
  gap: 1rem;
  align-content: start;
  min-height: 12rem;
  padding: 1.1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: var(--color-background-soft);
  transition:
    border-color var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
}

.feature-item:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-card);
  transform: translateY(-2px);
}

.feature-item__icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-control);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 1.15rem;
}

.feature-item h4 {
  margin: 0 0 0.45rem;
  color: var(--color-heading);
  font-size: 0.95rem;
}

.feature-item p {
  color: var(--color-text-muted);
  font-size: 0.84rem;
  line-height: 1.65;
}

@keyframes about-sky-drift {
  from {
    background-position: 38% 50%;
  }

  to {
    background-position: 58% 50%;
  }
}

@media (max-width: 46rem) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .feature-item {
    grid-template-columns: auto minmax(0, 1fr);
    min-height: 0;
  }
}
</style>
