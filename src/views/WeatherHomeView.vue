<script setup>
import { computed, ref, watch, watchEffect, onBeforeUpdate, onUpdated, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { CircleCheck, LocationInformation, OfficeBuilding, Refresh } from '@element-plus/icons-vue'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()
const route = useRoute()
// Pinia 스토어를 사용하여 날씨 데이터를 관리합니다.
const weatherStore = useWeatherStore()
// storeToRefs를 사용하여 스토어의 상태를 반응형으로 가져옵니다.
const { weatherList, isLoading, loadError } = storeToRefs(weatherStore)
const searchQuery = ref('')
const selectedCityInfo = ref(null)

// 날씨 데이터를 가져오는 함수를 정의합니다. force가 true면 캐시를 무시하고 새로 데이터를 가져옵니다.
const fetchRealTimeWeather = (force = false) => weatherStore.fetchWeather(force)

// 컴포넌트가 마운트될 때, URL 쿼리 파라미터를 확인하고 날씨 데이터를 로드합니다.
onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
})

// 필터링된 날씨 목록을 계산합니다. 검색어가 비어있으면 전체 목록을 반환하고, 그렇지 않으면 includes()를 사용하여 이름에 검색어가 포함된 도시만 반환합니다.
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') return weatherList.value

  return weatherList.value.filter((city) => city.name.includes(query))
})

// URL 쿼리 파라미터를 검색어와 동기화합니다.
watch(selectedCityInfo, (newCity, oldCity) => {
  const oldName = oldCity?.name ?? '선택 없음'
  const newName = newCity?.name ?? '선택 없음'
  console.log(`[watch] 상태바 문구 변경: ${oldName} → ${newName}`)
})

// watchEffect를 사용하여 검색어가 변경될 때마다 콘솔에 로그를 출력합니다.
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// URL 쿼리 파라미터를 검색어와 동기화합니다.
watch(searchQuery, (newQuery) => {
  // 검색 특성을 고려해 replace()를 사용하여 URL을 업데이트합니다. 검색어를 입력할 때마다 히스토리에 새로운 항목이 추가되지 않습니다.
  router.replace({
    path: route.path,
    // Spread operator를 사용하여 기존 쿼리 객체를 복사하고, search 속성만 새 값으로 업데이트합니다.
    // 만약 newQuery가 빈 문자열이면 undefined로 설정하여 URL에서 search 파라미터를 제거합니다.
    query: { ...route.query, search: newQuery || undefined },
  })
})

// 검색어를 업데이트하는 함수. SearchBar 컴포넌트에서 emit 이벤트를 통해 호출됩니다.
const updateSearchQuery = (query) => {
  searchQuery.value = query
}

// 선택된 도시를 업데이트하는 함수. WeatherCard 컴포넌트에서 emit 이벤트를 통해 호출됩니다.
const selectCity = (city) => {
  selectedCityInfo.value = city
}

// 상세 날씨 페이지로 이동하는 함수. WeatherCard 컴포넌트에서 emit 이벤트를 통해 호출됩니다.
const handleGoDetail = (city) => {
  // window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
  router.push({
    name: 'weather-detail',
    params: { cityId: city.id },
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
    <!-- SearchBar 컴포넌트에서 emit으로 보낸 @update-query 이벤트를 처리하여 검색어를 업데이트합니다. -->
    <!-- 업데이트된 query는 :query prop을 통해 전달됩니다. -->
    <SearchBar :query="searchQuery" @update-query="updateSearchQuery" />

    <BaseDashboardCard>
      <header class="weather-section-heading">
        <div>
          <h2 id="weather-title">
            <el-icon><OfficeBuilding /></el-icon>
            지역별 날씨
          </h2>
          <p>지금 가장 궁금한 지역의 날씨를 한눈에 확인하세요.</p>
        </div>
        <!-- el-tag를 사용하여 총 지역 수를 표시합니다. -->
        <el-tag type="info" effect="plain" round> {{ filteredWeatherList.length }}개 지역 </el-tag>
      </header>

      <!-- 로딩 중일 때는 el-skeleton을 사용하여 스켈레톤 UI를 표시합니다. -->
      <div v-if="isLoading" class="weather-skeleton-list">
        <el-skeleton v-for="index in 6" :key="index" animated :rows="3" />
      </div>

      <!-- 에러 발생 시 표시할 결과입니다. -->
      <el-result
        v-else-if="loadError"
        icon="error"
        title="날씨 정보를 불러오지 못했습니다"
        :sub-title="loadError"
      >
        <!-- 에러 발생 시 refresh 버튼을 표시합니다. -->
        <template #extra>
          <el-button type="primary" :icon="Refresh" @click="fetchRealTimeWeather(true)">
            다시 시도
          </el-button>
        </template>
      </el-result>

      <!-- 정상적으로 데이터를 불러왔을 때 표시할 결과입니다. -->
      <template v-else>
        <!-- 필터링된 날씨 목록을 표시합니다. -->
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
        <!-- 검색 결과가 없을 때 표시할 el-empty 컴포넌트입니다. -->
        <el-empty v-else :image-size="88" description="검색 결과와 일치하는 지역이 없습니다" />
      </template>
    </BaseDashboardCard>

    <!-- 선택된 지역 정보를 표시하는 상태바입니다. -->
    <div class="selection-status" :class="{ 'selection-status--selected': selectedCityInfo }">
      <el-icon>
        <!-- 선택된 지역이 있을 때 CircleCheck 아이콘을 표시하고, 없을 때 LocationInformation 아이콘을 표시합니다. -->
        <CircleCheck v-if="selectedCityInfo" />
        <LocationInformation v-else />
      </el-icon>
      <span v-if="selectedCityInfo">
        <strong>{{ selectedCityInfo.name }}</strong> 지역이 선택되었습니다.
      </span>
      <!-- 선택된 지역이 없을 때 표시할 안내 문구입니다. -->
      <span v-else>카드를 선택하면 현재 선택한 지역을 여기에서 확인할 수 있습니다.</span>
    </div>
  </main>
</template>

<style scoped>
.weather-mockup {
  display: grid;
  grid-column: 1 / -1;
  gap: 1rem;
  width: 100%;
  max-width: var(--content-width);
  margin: 1.25rem auto 2rem;
}

.weather-section-heading {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.25rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.weather-section-heading h2 {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.weather-section-heading h2 .el-icon {
  color: var(--color-primary);
}

.weather-section-heading p:last-child {
  margin-top: 0.35rem;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.weather-section-heading :deep(.el-tag) {
  border-color: var(--glass-border);
  background: var(--glass-control);
}

.weather-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.875rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.weather-skeleton-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.weather-skeleton-list :deep(.el-skeleton) {
  min-height: 10.5rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
}

.selection-status {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  min-height: 3rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-control);
  background: var(--glass-surface);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 6%);
  backdrop-filter: var(--glass-filter);
  -webkit-backdrop-filter: var(--glass-filter);
}

.selection-status--selected {
  border-color: var(--el-color-primary-light-7);
  background: var(--glass-accent);
  color: var(--color-primary);
}

@media (max-width: 44rem) {
  .weather-list,
  .weather-skeleton-list {
    grid-template-columns: 1fr;
  }

  .weather-section-heading {
    align-items: flex-start;
  }
}
</style>
