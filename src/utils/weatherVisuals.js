import clearDay from '@/assets/weather/clear-day-v2.jpg'
import clearNight from '@/assets/weather/clear-night-stars-v3.jpg'
import cloudyDay from '@/assets/weather/cloudy-day-v2.jpg'
import cloudyNight from '@/assets/weather/cloudy-night-v2.jpg'
import rainDay from '@/assets/weather/rain-day-v2.jpg'
import rainNight from '@/assets/weather/rain-night-v2.jpg'

// 날씨 종류와 시간대에 따른 배경 이미지를 매핑하는 객체입니다.
const weatherBackgrounds = {
  'clear-day': clearDay,
  'clear-night': clearNight,
  'cloudy-day': cloudyDay,
  'cloudy-night': cloudyNight,
  'rain-day': rainDay,
  'rain-night': rainNight,
}

// 이 단어들을 포함하는 날씨 상태 문자열은 각각 'rain'과 'cloudy'로 분류됩니다.
const rainWords = ['비', '소나기', '뇌우', '우박', 'rain', 'drizzle', 'thunder']
const cloudyWords = [
  '구름',
  '흐림',
  '안개',
  '박무',
  '연무',
  '눈',
  'cloud',
  'mist',
  'fog',
  'haze',
  'snow',
]

// 날씨 상태 문자열을 기반으로 날씨 종류를 결정합니다.
export const getWeatherKind = (status = '') => {
  const normalizedStatus = status.toLowerCase()

  // 비와 구름 관련 단어를 포함하는지 확인하여 날씨 종류를 결정합니다.
  if (rainWords.some((word) => normalizedStatus.includes(word))) return 'rain'
  if (cloudyWords.some((word) => normalizedStatus.includes(word))) return 'cloudy'

  return 'clear'
}

// 시간대와 일출, 일몰을 고려하여 현재 시간을 기준으로 낮과 밤을 구분합니다.
export const getTimeOfDay = ({ currentTime, sunrise, sunset, timezoneOffset = 0 }) => {
  if (
    Number.isFinite(currentTime) &&
    Number.isFinite(sunrise) &&
    Number.isFinite(sunset) &&
    sunrise < sunset
  ) {
    // 현재 시간이 일출과 일몰 사이에 있는지 확인하여 낮과 밤을 구분합니다.
    return currentTime >= sunrise && currentTime < sunset ? 'day' : 'night'
  }

  // 일출과 일몰 정보가 없거나 유효하지 않은 경우, 시간대 오프셋을 고려하여 UTC 기준으로 낮과 밤을 구분합니다.
  const localHour = new Date((currentTime + timezoneOffset) * 1000).getUTCHours()
  return localHour >= 6 && localHour < 18 ? 'day' : 'night'
}

// 날씨 상태와 시간대에 따라 배경 이미지를 반환합니다.
export const getWeatherBackground = (status, timeOfDay = 'day') => {
  const kind = getWeatherKind(status)
  // 날씨 종류와 시간대에 따라 배경 이미지를 선택합니다. 만약 해당 조합의 이미지가 없으면 Null 병합 연산자를 사용하여 기본 이미지(clearDay)를 반환합니다.
  return weatherBackgrounds[`${kind}-${timeOfDay}`] ?? clearDay
}

// 현재 관측 시간을 유닉스 시간과 오프셋을 고려하여 포맷된 문자열로 반환합니다.
export const formatLocalObservationTime = (unixSeconds, timezoneOffset = 0) => {
  if (!Number.isFinite(unixSeconds)) return '현재 관측'

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'UTC',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date((unixSeconds + timezoneOffset) * 1000))
}
