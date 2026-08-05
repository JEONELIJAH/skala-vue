<script setup>
import { ref } from 'vue'
import axios from 'axios'

const postId = ref(1)
const post = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')
const hasWeatherApiKey = Boolean(import.meta.env.VITE_OPENWEATHER_API_KEY)

const fetchPost = async () => {
  isLoading.value = true
  errorMessage.value = ''
  post.value = null

  try {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${postId.value}`)
    post.value = response.data
  } catch (error) {
    console.error('Axios JSON 요청 실패:', error)
    errorMessage.value = 'JSON 데이터를 가져오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="axios-layout">
    <section class="axios-card">
      <span class="axios-card__label">Axios JSON Example</span>
      <h3>공개 JSON API 요청</h3>
      <p>버튼을 누르면 axios.get()으로 JSONPlaceholder의 게시글을 가져옵니다.</p>

      <div class="axios-controls">
        <el-input-number v-model="postId" :min="1" :max="100" />
        <el-button type="primary" :loading="isLoading" @click="fetchPost">
          JSON 불러오기
        </el-button>
      </div>

      <el-alert v-if="errorMessage" type="error" :closable="false" :title="errorMessage" />
      <pre v-else-if="post">{{ JSON.stringify(post, null, 2) }}</pre>
      <p v-else class="axios-empty">요청 전입니다. 게시글 번호를 선택해 주세요.</p>
    </section>

    <section class="axios-card">
      <span class="axios-card__label">OpenWeather API</span>
      <h3>날씨 프로젝트 연동 상태</h3>
      <p>메인 대시보드와 상세 화면이 위도·경도 기반 실시간 요청을 사용합니다.</p>

      <dl class="api-status">
        <div>
          <dt>axios</dt>
          <dd>설치 완료</dd>
        </div>
        <div>
          <dt>환경 변수</dt>
          <dd>{{ hasWeatherApiKey ? '키 감지됨' : '키 확인 필요' }}</dd>
        </div>
        <div>
          <dt>요청 방식</dt>
          <dd>async / await</dd>
        </div>
      </dl>

      <RouterLink class="weather-link" :to="{ name: 'weather-home' }">
        실시간 날씨 예제 보기
      </RouterLink>
    </section>
  </div>
</template>

<style scoped>
.axios-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.axios-card {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.axios-card__label {
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.axios-card h3 {
  margin-top: 0.2rem;
  font-size: 1rem;
}

.axios-card > p {
  margin: 0.25rem 0 0.85rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.axios-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.axios-card pre {
  max-height: 15rem;
  margin: 0;
  padding: 0.75rem;
  border-radius: var(--radius-control);
  background: rgb(2 28 55 / 58%);
  color: #c9f1ff;
  font-size: 0.72rem;
  overflow: auto;
}

.axios-empty {
  padding: 1rem;
  border: 1px dashed var(--color-border-hover);
  border-radius: var(--radius-control);
  text-align: center;
}

.api-status {
  display: grid;
  gap: 0.45rem;
  margin: 0 0 0.8rem;
}

.api-status div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0.7rem;
  border-radius: var(--radius-control);
  background: var(--glass-control);
}

.api-status dt {
  color: var(--color-text-muted);
  font-size: 0.72rem;
}

.api-status dd {
  margin: 0;
  color: var(--color-heading);
  font-size: 0.76rem;
  font-weight: 700;
}

.weather-link {
  display: inline-flex;
  min-height: 2.5rem;
  padding: 0 0.8rem;
  border: 1px solid var(--color-border-hover);
  border-radius: var(--radius-control);
  align-items: center;
  color: var(--color-heading);
  font-size: 0.78rem;
  font-weight: 700;
}

@media (max-width: 44rem) {
  .axios-layout {
    grid-template-columns: 1fr;
  }
}
</style>
