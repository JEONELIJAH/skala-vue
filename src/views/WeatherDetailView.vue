<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const props = defineProps({
    cityId: {
        type: String,
        required: true,
    }
})

const cities = [
  { id: 1, name: '서울특별시', temp: 28, status: '맑음', humidity: 55, wind: 2.5 },
  { id: 2, name: '수원시', temp: 24, status: '비', humidity: 70, wind: 1.8 },
  { id: 3, name: '부산광역시', temp: 26, status: '구름', humidity: 65, wind: 3.1 },
  { id: 4, name: '인천광역시', temp: 21, status: '맑음', humidity: 52, wind: 2.1 },
  { id: 5, name: '제주시', temp: 26, status: '바람', humidity: 60, wind: 4.2 },
]

const handleGoHome = () => {
    router.push('/')
}

const city = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (cities[id]) {
    city.value = cities[id]
  }
})

</script>

<template>
  <main class="detail">
    <section v-if="city" class="detail-card">
      <h2 id="detail-title">📊 지역별 상세 기상 관측 정보</h2>

      <div class="weather-summary">
        <p>📍 지정 지역: 대한민국 {{ city.name }}</p>
        <p>실시간 기온: {{ city.temp }}°C</p>
        <p>기상 현황: {{ city.status }}</p>
        <p>대기 습도: {{ city.humidity }}%</p>
        <p>현재 풍속: {{ city.wind }}m/s</p>
      </div>

      <button class="home-link" @click="handleGoHome" type="button"> ← 메인 대시보드로 돌아가기 </button>
    </section>

    <section v-else class="detail-card">
      <h2 id="missing-title">지역 정보를 찾을 수 없습니다.</h2>
      <p>요청한 도시 코드가 Mock Data에 없습니다.</p>
      <button class="home-link" @click="handleGoHome" type="button"> ← 메인 대시보드로 돌아가기 </button>
    </section>
  </main>
</template>

<style scoped>
.detail {
  width: 100%;
  max-width: 60rem;
  margin: 2rem auto 0;
}

.detail-card {
  margin-top: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-background-soft);
}

.detail-card p {
  margin: 0 0 1rem;
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

</style>
