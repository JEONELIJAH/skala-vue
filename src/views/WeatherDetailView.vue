<script setup>
import { defineProps, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const router = useRouter()
const configStore = useConfigStore()
const isLoading = ref(false)

const props = defineProps({
    cityId: {
        type: String,
        required: true,
    }
})

const cityMapping = {
  1: { lat: 37.5665, lon: 126.978, korean: '대한민국 서울특별시' },
  2: { lat: 37.2636, lon: 127.0286, korean: '대한민국 경기도 수원시' },
  3: { lat: 35.1631, lon: 129.1635, korean: '대한민국 부산광역시' },
  4: { lat: 37.4563, lon: 126.7052, korean: '대한민국 인천광역시' },
  5: { lat: 33.4996, lon: 126.5312, korean: '대한민국 제주특별자치도 제주시' },
  6: { lat: 78.2232, lon: 15.6469, korean: '북극 스발바르' },
  7: { lat: -77.8419, lon: 166.6863, korean: '남극 맥머도 기지' },
  8: { lat: 31.1, lon: -4, korean: '모로코 사하라 사막' },
  9: { lat: -22.9087, lon: -68.1997, korean: '칠레 아타카마 사막' },
  10: { lat: 36.4641, lon: -116.8687, korean: '미국 데스밸리' },
}

const displayTemp = computed(() => {
  const rawTemp = city.value?.temp

  if (rawTemp === null) {
    return ''
  }

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const handleGoHome = () => {
    router.push('/')
}

const city = ref(null)

onMounted(async() => {
  // const id = route.params.cityId
  const targetCity = cityMapping[props.cityId]
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

  if (targetCity) {
    isLoading.value = true
    
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          lat: targetCity.lat,
          lon: targetCity.lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'kr',
        },
      })
      const raw = response.data

      city.value = {
          name: targetCity.korean,
          temp: raw.main.temp,
          status: raw.weather[0].description,
          humidity: `${raw.main.humidity}`,
          wind: `${raw.wind.speed}`,
      }
    } catch (error) {
      console.error('🔴 상세 정보 로딩 중 네트워크 에러 발생:', error)
    } finally {
      isLoading.value = false
    }
  }
})

</script>

<template>
  <main class="detail">
    <section class="detail-card">
      <h2 id="detail-title">📊 지역별 상세 기상 관측 정보</h2>

      <p v-if="isLoading" class="status-message">상세 날씨 정보를 불러오는 중입니다...</p>

      <template v-else-if="city">
        <div class="weather-summary">
          <p>📍 지정 지역: {{ city.name }}</p>
          <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
          <p>기상 현황: {{ city.status }}</p>
          <p>대기 습도: {{ city.humidity }}%</p>
          <p>현재 풍속: {{ city.wind }}m/s</p>
        </div>
      </template>

      <p v-else class="status-message"> 해당 지역의 상세 데이터 장부가 존재하지 않거나 에러가 발생했습니다. </p>

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
