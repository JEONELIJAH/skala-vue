<script setup>
import { computed, ref, watch, watchEffect, onBeforeUpdate, onUpdated} from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([
  { id: 1, name: '서울', temp: 28, status: '맑음' },
  { id: 2, name: '수원', temp: 24, status: '비' },
  { id: 3, name: '부산', temp: 26, status: '구름' },
  { id: 4, name: '인천', temp: 21, status: '맑음' },
  { id: 5, name: '제주', temp: 26, status: '바람' },
])

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
