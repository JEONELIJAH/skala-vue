import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { formatLocalObservationTime, getTimeOfDay } from '@/utils/weatherVisuals'

const CACHE_TTL = 10 * 60 * 1000
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const cityLocations = [
  { id: 1, name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 2, name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 3, name: '부산', lat: 35.1631, lon: 129.1635 },
  { id: 4, name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 5, name: '제주', lat: 33.4996, lon: 126.5312 },
  { id: 6, name: '북극', lat: 78.2232, lon: 15.6469 },
  { id: 7, name: '남극', lat: -77.8419, lon: 166.6863 },
  { id: 8, name: '사하라 사막', lat: 31.1, lon: -4.0 },
  { id: 9, name: '아타카마 사막', lat: -22.9087, lon: -68.1997 },
  { id: 10, name: '데스밸리', lat: 36.4641, lon: -116.8687 },
]

export const useWeatherStore = defineStore('weather', () => {
  // state
  const weatherList = ref([])
  const isLoading = ref(false)
  const loadError = ref('')
  const fetchedAt = ref(0)

  // getters
  function hasFreshCache() {
    return weatherList.value.length > 0 && Date.now() - fetchedAt.value < CACHE_TTL
  }

  // actions
  async function fetchWeather(force = false) {
    if (!force && hasFreshCache()) return weatherList.value
    if (isLoading.value) return weatherList.value

    isLoading.value = true
    loadError.value = ''

    try {
      const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
      const responses = await Promise.all(
        cityLocations.map((city) => {
          return axios.get(BASE_URL, {
            params: {
              lat: city.lat,
              lon: city.lon,
              appid: API_KEY,
              units: 'metric',
              lang: 'kr',
            },
          })
        }),
      )

      weatherList.value = responses.map((response, index) => {
        const raw = response.data
        const city = cityLocations[index]

        return {
          id: city.id,
          name: city.name,
          temp: raw.main.temp,
          status: raw.weather[0]?.description ?? '정보 없음',
          localTime: formatLocalObservationTime(raw.dt, raw.timezone),
          timeOfDay: getTimeOfDay({
            currentTime: raw.dt,
            sunrise: raw.sys?.sunrise,
            sunset: raw.sys?.sunset,
            timezoneOffset: raw.timezone,
          }),
          timezone: raw.timezone,
        }
      })
      fetchedAt.value = Date.now()

      return weatherList.value
    } catch (error) {
      console.error('🔴 날씨 정보 로딩 중 네트워크 에러 발생:', error)
      loadError.value = '날씨 정보를 불러오지 못했습니다. 네트워크 연결과 API 설정을 확인해 주세요.'
      return weatherList.value
    } finally {
      isLoading.value = false
    }
  }

  return {
    weatherList,
    isLoading,
    loadError,
    fetchedAt,
    hasFreshCache,
    fetchWeather,
  }
})
