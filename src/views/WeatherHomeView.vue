<script setup>
import { computed, ref, watch, watchEffect, onBeforeUpdate, onUpdated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import axios from 'axios'

const router = useRouter()
const route = useRoute()
const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([])
const isLoading = ref(false)

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cityLocations = [
  { id: 1, name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 2, name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 3, name: '부산', lat: 35.1631, lon: 129.1635 },
  { id: 4, name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 5, name: '제주', lat: 33.4996, lon: 126.5312 },
]

const fetchRealTimeWeather = async() => {
  isLoading.value = true

  try {
    // 여러 도시의 날씨 API를 동시에 비동기 호출
    const responses = await Promise.all(
      cityLocations.map((city) => {
        return axios.get(BASE_URL, {
          params: {
            lat: city.lat,
            lon: city.lon,
            appid: API_KEY,
            units: 'metric',
            lang: 'kr',
          }
        })
      })
    )

    weatherList.value = responses.map((response, index) => {
      const raw = response.data
      const city = cityLocations[index]

      return {
        id: city.id,
        name: city.name,
        temp: raw.main.temp,
        status: raw.weather[0]?.description ?? '정보 없음',
      }
    })
  } catch (error) {
      console.error('🔴 날씨 정보 로딩 중 네트워크 에러 발생:', error)
    } finally {
      isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') return weatherList.value

  return weatherList.value.filter((city) => city.name.includes(query))
})

watch(selectedCityInfo, (newCity, oldCity) => {
  const oldName = oldCity?.name ?? '선택 없음'
  const newName = newCity?.name ?? '선택 없음'
  console.log(`[watch] 상태바 문구 변경: ${oldName} → ${newName}`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

const selectCity = (city) => {
  selectedCityInfo.value = city
}

const handleGoDetail = (city) => {
  // window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
  router.push({
    name: 'weather-detail',
    params: {cityId: city.id}
  })
}

const log = (hook) => {
  console.log(`[WeatherParent] ${hook}`)
}

// const handleGoHome = () => {
//   router.push('/')
// }

// const handleGoAbout = () => {
//   router.push('/about')
// }

onBeforeUpdate(() => log('onBeforeUpdate'))
onUpdated(() => log('onUpdated'))
</script>

<template>
  <main class="weather-mockup">
    <SearchBar :query="searchQuery" @update-query="updateSearchQuery" />

    <BaseDashboardCard>
      <h2 id="weather-title">🌆 지역별 날씨 현황</h2>

      <p v-if="isLoading" class="status-message">🔄 글로벌 기상 위성으로부터 실시간 기상 데이터를 수신 중입니다...</p>

      <template v-else>
        <ul v-if="filteredWeatherList.length > 0" class="weather-list">
          <li v-for="city in filteredWeatherList" :key="city.id">
            <WeatherCard
              :city="city"
              :selected="selectedCityInfo?.id === city.id"
              @select-card="selectCity(city)"
              @click-detail="handleGoDetail(city)"
            />
          </li>
        </ul>
        <p v-else class="empty-message" role="status">검색 결과가 일치하는 도시가 없습니다.</p>
      </template>
    </BaseDashboardCard>

    <p class="selection-status" aria-live="polite">
      <template v-if="selectedCityInfo"> {{ selectedCityInfo.name }}이 선택되었습니다. </template>
      <template v-else>카드를 클릭하거나 검색해 보세요.</template>
    </p>
  </main>
</template>

<style scoped>
.weather-mockup {
  display: grid;
  grid-column: 1 / -1;
  gap: 1rem;
  width: 100%;
  max-width: 60rem;
  margin: 2rem auto;
}

.weather-mockup h1 {
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
}

.weather-list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.selection-status {
  margin: 0;
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  background: #e6ffed;
  color: #176b36;
  font-weight: 700;
  text-align: center;
}
</style>
