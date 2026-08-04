<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const handleGoHome = () => {
    router.push('/')
}
</script>

<template>
  <main class="not-found">
    <section class="not-found-card">
      <div class="not-found-icon">☀️ ❓</div>
      <h2 id="not-found-title">페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나,<br />아직 개발되지 않았습니다.</p>
      <button class="home-link" @click="handleGoHome" type="button"> 날씨 메인으로 이동 </button>
    </section>
  </main>
</template>

<style scoped>
.not-found {
  display: grid;
  place-items: center;
  width: 100%;
  max-width: 60rem;
  min-height: 28rem;
  padding: 2rem 1rem;
  margin: 2rem auto 0;
  background: var(--color-background-soft);
}

.not-found-card {
  width: min(100%, 22rem);
  padding: 3rem 2rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-background);
  box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 10%);
  text-align: center;
}

.not-found-icon {
  margin-bottom: 1.5rem;
  font-size: 3.5rem;
  line-height: 1;
}

.not-found-card h2 {
  margin: 0;
  font-size: clamp(1.25rem, 4vw, 1.6rem);
  font-weight: 700;
}

.not-found-card p {
  margin: 1rem 0 1.5rem;
  color: var(--color-text);
  line-height: 1.7;
}

.home-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.75rem;
  padding: 0.65rem 1.25rem;
  border-radius: 999px;
  background: #1683f7;
  color: white;
  font-weight: 700;
  text-decoration: none;
}

.home-link:hover {
  background: #0d6dcc;
}
</style>
