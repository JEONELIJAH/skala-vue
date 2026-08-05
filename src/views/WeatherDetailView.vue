<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft,
  Cloudy,
  Compass,
  Drizzling,
  LocationFilled,
  MostlyCloudy,
  Odometer,
  Pouring,
  Sunrise,
  Sunny,
  View,
} from '@element-plus/icons-vue'
import axios from 'axios'
import { useConfigStore } from '@/stores/configStore'
import {
  formatLocalObservationTime,
  getTimeOfDay,
  getWeatherBackground,
  getWeatherKind,
} from '@/utils/weatherVisuals'

const currentTime = ref(Date.now())
let timer = null

// 실시간 currentTime과 도시의 timezone을 조합해 시각을 포맷팅합니다.
const dynamicLocalTime = computed(() => {
  if (city.value && city.value.timezone !== undefined) {
    const now = new Date(currentTime.value)

    // 현재 기기의 타임존 오프셋을 제거하여 순수 UTC 시간을 구합니다.
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000

    // 타겟 도시의 타임존 오프셋을 더합니다.
    const targetTime = new Date(utcTime + city.value.timezone * 1000)

    // Intl.DateTimeFormat을 사용하여 한국어 형식으로 시각을 포맷팅합니다. 12시간제와 분 단위까지 표시합니다.
    return new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(targetTime)
  }

  // 만약 timezone 정보가 없다면 기존의 정적 데이터로 폴백(Fallback)
  return props.city.localTime ?? '현재'
})

const router = useRouter()
const configStore = useConfigStore()
const isLoading = ref(true)
const city = ref(null)

// 부모 컴포넌트가 아닌, Vue Router를 통해 URL params를 props로 전달받습니다. (props: true)
// 이 전달받은 cityId를 기반으로 상세 날씨 데이터를 로드합니다.
const props = defineProps({
  cityId: {
    type: String,
    required: true,
  },
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

// 온도 변환 함수
const convertTemp = (temperature) => {
  const convertedTemp = configStore.unit === 'fahrenheit' ? (temperature * 9) / 5 + 32 : temperature

  return Number(convertedTemp.toFixed(1))
}

const displayTemp = computed(() => (city.value ? convertTemp(city.value.temp) : ''))
const displayMaxTemp = computed(() => (city.value ? convertTemp(city.value.tempMax) : ''))
const displayMinTemp = computed(() => (city.value ? convertTemp(city.value.tempMin) : ''))

// 풍향을 각도로부터 텍스트로 변환하는 함수
const getWindDirection = (degree = 0) => {
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
  return directions[Math.round(degree / 45) % directions.length]
}

// 날씨와 시간대에 따른 CSS 클래스와 배경 이미지를 계산합니다.
const weatherVisualClass = computed(() => {
  // city가 아직 로드되지 않은 경우 빈 배열을 반환합니다.
  if (!city.value) return []

  return [
    `weather-detail--${getWeatherKind(city.value.status)}`,
    `weather-detail--${city.value.timeOfDay}`,
  ]
})

// 상세 날씨 배경 스타일을 계산합니다.
const detailBackgroundStyle = computed(() => {
  // city가 아직 로드되지 않은 경우 빈 객체를 반환합니다.
  if (!city.value) return {}

  return {
    backgroundImage: `url(${getWeatherBackground(city.value.status, city.value.timeOfDay)})`,
  }
})

const weatherMetrics = computed(() => {
  // city가 아직 로드되지 않은 경우 빈 배열을 반환합니다.
  if (!city.value) return []

  return [
    {
      label: '체감 온도',
      value: `${convertTemp(city.value.feelsLike)}${configStore.unitSymbol}`,
      description: '바람과 습도를 반영한 온도',
      icon: Sunny,
    },
    {
      label: '습도',
      value: `${city.value.humidity}%`,
      description: '현재 대기 중 수분 비율',
      icon: Pouring,
    },
    {
      label: '풍속',
      value: `${city.value.wind} m/s`,
      description: city.value.windGust
        ? `${city.value.windDirection}풍 · 돌풍 ${city.value.windGust} m/s`
        : `${city.value.windDirection}풍 · ${city.value.windDegrees}°`,
      icon: Compass,
    },
    {
      label: '구름량',
      value: `${city.value.cloudiness}%`,
      description: '현재 하늘을 덮고 있는 구름의 비율',
      icon: Cloudy,
    },
    {
      label: '기압',
      value: `${city.value.pressure.toLocaleString()} hPa`,
      description: '해수면 기준 대기 압력',
      icon: Odometer,
    },
    {
      label: '가시거리',
      value: `${city.value.visibility.toFixed(1)} km`,
      description: '육안으로 확인 가능한 거리',
      icon: View,
    },
    {
      label: '시간 강수량',
      value: `${city.value.precipitation} mm`,
      description: '최근 한 시간 동안의 강수량',
      icon: Drizzling,
    },
    {
      label: '일출 · 일몰',
      value: city.value.sunrise,
      description: `일몰 ${city.value.sunset}`,
      icon: Sunrise,
    },
  ]
})

const handleGoHome = () => {
  router.push('/')
}

// 컴포넌트가 화면에서 사라지면 타이머를 꺼서 메모리 누수를 막습니다.
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 컴포넌트가 마운트될 때, cityId를 기반으로 OpenWeather API에서 상세 날씨 데이터를 가져옵니다.
onMounted(async () => {
  const targetCity = cityMapping[props.cityId]
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

  // 1분마다 currentTime을 갱신하는 타이머를 작동시킵니다.
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 60000)

  // cityId에 해당하는 도시 정보가 없으면 로딩 상태를 false로 설정하고 함수를 종료합니다.
  if (!targetCity) {
    isLoading.value = false
    return
  }

  // OpenWeather API를 호출하여 상세 날씨 데이터를 await를 사용하여 비동기로 가져옵니다.
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
      name: targetCity.korean, // 한국어 이름
      temp: raw.main.temp, // 현재 온도
      tempMax: raw.main.temp_max, // 최고 온도
      tempMin: raw.main.temp_min, // 최저 온도
      feelsLike: raw.main.feels_like, // 체감 온도
      status: raw.weather[0]?.description ?? '정보 없음', // 날씨 상태 optional chainin, nullish coalescing 사용
      humidity: raw.main.humidity, // 습도
      wind: raw.wind.speed, // 풍속
      windGust: raw.wind.gust, // 돌풍
      windDegrees: raw.wind.deg ?? 0, // 풍향 각도
      windDirection: getWindDirection(raw.wind.deg), // 풍향 텍스트
      cloudiness: raw.clouds?.all ?? 0, // 구름량
      pressure: raw.main.pressure, // 기압
      visibility: (raw.visibility ?? 0) / 1000, // 가시거리
      precipitation: raw.rain?.['1h'] ?? raw.snow?.['1h'] ?? 0, // 강수량
      localTime: formatLocalObservationTime(raw.dt, raw.timezone), // 관측 시간
      timezone: raw.timezone, // 타임존
      sunrise: formatLocalObservationTime(raw.sys?.sunrise, raw.timezone), // 일출 시간
      sunset: formatLocalObservationTime(raw.sys?.sunset, raw.timezone), // 일몰 시간
      iconUrl: raw.weather[0]?.icon
        ? `https://openweathermap.org/img/wn/${raw.weather[0].icon}@2x.png`
        : '', // 아이콘 URL
      timeOfDay: getTimeOfDay({
        // 낮/밤 구분을 위한 시간대 계산
        currentTime: raw.dt,
        sunrise: raw.sys?.sunrise,
        sunset: raw.sys?.sunset,
        timezoneOffset: raw.timezone,
      }),
    }
  } catch (error) {
    console.error('상세 날씨 정보 로딩 중 네트워크 오류가 발생했습니다.', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <main class="detail-page">
    <el-card v-if="isLoading" class="loading-panel" shadow="never">
      <el-skeleton :rows="7" animated />
      <p>날씨 정보를 불러오고 있습니다.</p>
    </el-card>

    <section
      v-else-if="city"
      class="weather-detail"
      :class="weatherVisualClass"
      :style="detailBackgroundStyle"
    >
      <header class="weather-hero">
        <p class="weather-hero__location">
          <el-icon><LocationFilled /></el-icon>
          {{ city.name }}
        </p>
        <!-- 현지 시각 -->
        <span class="weather-hero__time">{{ dynamicLocalTime }} 현지 시각</span>

        <!-- 현재 온도 -->
        <div class="weather-hero__temperature">
          <strong>{{ displayTemp }}</strong>
          <span>{{ configStore.unitSymbol }}</span>
        </div>

        <!-- 날씨 상태 -->
        <p class="weather-hero__status">
          <img v-if="city.iconUrl" :src="city.iconUrl" :alt="city.status" />
          <el-icon v-else><MostlyCloudy /></el-icon>
          {{ city.status }}
        </p>

        <!-- 온도 범위 -->
        <p class="weather-hero__range">
          최고 {{ displayMaxTemp }}{{ configStore.unitSymbol }} · 최저 {{ displayMinTemp
          }}{{ configStore.unitSymbol }}
        </p>
      </header>

      <!-- 날씨 지표 -->
      <section class="weather-metrics">
        <article v-for="metric in weatherMetrics" :key="metric.label" class="weather-metric">
          <header>
            <el-icon><component :is="metric.icon" /></el-icon>
            <span>{{ metric.label }}</span>
          </header>
          <strong>{{ metric.value }}</strong>
          <p>{{ metric.description }}</p>
        </article>
      </section>

      <footer class="weather-detail__footer">
        <el-button :icon="ArrowLeft" @click="handleGoHome">메인으로 돌아가기</el-button>
        <p>OpenWeather · {{ city.localTime }} 업데이트</p>
      </footer>
    </section>

    <!-- 에러 메시지 -->
    <el-card v-else class="error-panel" shadow="never">
      <el-result
        icon="warning"
        title="지역 정보를 불러오지 못했습니다"
        sub-title="도시 코드가 올바른지 확인하거나 잠시 후 다시 시도해 주세요."
      >
        <template #extra>
          <el-button type="primary" :icon="ArrowLeft" @click="handleGoHome">
            메인으로 돌아가기
          </el-button>
        </template>
      </el-result>
    </el-card>
  </main>
</template>

<style scoped>
.detail-page {
  width: 100%;
  max-width: var(--content-width);
  margin: 1.25rem auto 2rem;
}

.weather-detail {
  position: relative;
  padding: clamp(1rem, 3vw, 1.5rem);
  border: 1px solid rgb(255 255 255 / 34%);
  border-radius: 1.35rem;
  background-position: 44% 50%;
  background-size: cover;
  box-shadow: 0 1.5rem 3.5rem rgb(5 45 82 / 24%);
  overflow: hidden;
  isolation: isolate;
  animation: weather-detail-drift 46s ease-in-out infinite alternate;
}

.weather-detail::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(3 43 78 / 30%);
  content: '';
}

.weather-detail--cloudy::before {
  background: rgb(11 33 51 / 34%);
}

.weather-detail--rain::before {
  background: rgb(2 20 43 / 42%);
}

.weather-detail--night::before {
  background: rgb(2 12 31 / 34%);
}

.weather-detail--night.weather-detail--rain::before {
  background: rgb(1 8 24 / 42%);
}

.weather-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 17rem;
  padding: 2rem 1rem;
  color: #fff;
  text-align: center;
  text-shadow: 0 2px 12px rgb(0 31 63 / 38%);
}

.weather-hero__location,
.weather-hero__status {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  font-weight: 700;
}

.weather-hero__location {
  font-size: clamp(1.15rem, 4vw, 1.55rem);
}

.weather-hero__time {
  margin-top: 0.25rem;
  color: rgb(255 255 255 / 76%);
  font-size: 0.78rem;
  font-weight: 650;
}

.weather-hero__temperature {
  margin: 0.35rem 0;
  line-height: 1;
}

.weather-hero__temperature strong {
  color: #fff;
  font-size: clamp(4.2rem, 14vw, 7rem);
  font-variant-numeric: tabular-nums;
  font-weight: 350;
  letter-spacing: -0.08em;
}

.weather-hero__temperature span {
  margin-left: 0.25rem;
  font-size: clamp(1.2rem, 4vw, 1.8rem);
  font-weight: 700;
  vertical-align: top;
}

.weather-hero__status {
  font-size: 1.05rem;
}

.weather-hero__status img {
  width: 2.4rem;
  height: 2.4rem;
  margin: -0.6rem -0.25rem -0.6rem -0.5rem;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgb(0 24 48 / 30%));
}

.weather-hero__range {
  margin-top: 0.55rem;
  color: rgb(255 255 255 / 86%);
  font-size: 0.88rem;
  font-weight: 650;
}

.weather-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
}

.weather-metric {
  display: flex;
  flex-direction: column;
  min-height: 10rem;
  padding: 1.1rem;
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 1rem;
  background: rgb(8 52 92 / 32%);
  color: #fff;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 10%);
  backdrop-filter: blur(16px) saturate(115%);
}

.weather-metric header {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  color: rgb(255 255 255 / 68%);
  font-size: 0.8rem;
  font-weight: 700;
}

.weather-metric > strong {
  margin-top: 0.8rem;
  color: #fff;
  font-size: clamp(1.65rem, 5vw, 2.2rem);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  letter-spacing: -0.04em;
}

.weather-metric p {
  margin-top: auto;
  color: rgb(255 255 255 / 78%);
  font-size: 0.78rem;
  line-height: 1.45;
}

.weather-detail__footer {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.weather-detail__footer > p {
  color: rgb(255 255 255 / 72%);
  font-size: 0.75rem;
  font-weight: 650;
}

.weather-detail__footer .el-button {
  min-height: 2.75rem;
  border-color: rgb(255 255 255 / 35%);
  background: rgb(6 36 69 / 28%);
  color: #fff;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.weather-detail__footer .el-button:hover {
  border-color: rgb(255 255 255 / 70%);
  background: rgb(6 36 69 / 44%);
  color: #fff;
}

.loading-panel,
.error-panel {
  border-color: var(--color-border);
  border-radius: var(--radius-panel);
  background: var(--color-surface-raised);
}

.loading-panel :deep(.el-card__body) {
  padding: 2rem;
}

.loading-panel p {
  margin-top: 1rem;
  color: var(--color-text-muted);
  text-align: center;
}

@keyframes weather-detail-drift {
  from {
    background-position: 40% 50%;
  }

  to {
    background-position: 60% 50%;
  }
}

@media (max-width: 52rem) {
  .weather-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 30rem) {
  .weather-metrics {
    grid-template-columns: 1fr;
  }

  .weather-metric {
    min-height: 8.5rem;
  }

  .weather-detail__footer .el-button {
    width: 100%;
  }

  .weather-detail__footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .weather-detail__footer > p {
    text-align: center;
  }
}
</style>
