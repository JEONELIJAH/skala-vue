<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { ArrowRight } from '@element-plus/icons-vue'
import { getWeatherBackground, getWeatherKind } from '@/utils/weatherVisuals'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const configStore = useConfigStore()

const currentTime = ref(Date.now())
let timer = null

// 1분마다 currentTime을 갱신하는 타이머를 작동시킵니다.
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = Date.now()
  }, 60000)
})

// 컴포넌트가 화면에서 사라지면 타이머를 꺼서 메모리 누수를 막습니다.
onUnmounted(() => {
  if (timer) clearInterval(timer)
})

// 실시간 currentTime과 도시의 timezone을 조합해 시각을 포맷팅합니다.
const dynamicLocalTime = computed(() => {
  if (props.city.timezone !== undefined) {
    const now = new Date(currentTime.value)

    // 현재 기기의 타임존 오프셋을 제거하여 순수 UTC 시간을 구합니다.
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000

    // 타겟 도시의 타임존 오프셋을 더합니다.
    const targetTime = new Date(utcTime + props.city.timezone * 1000)

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

// 온도 단위를 변환하는 함수
const convertTemp = (temperature) => {
  const convertedTemp = configStore.unit === 'fahrenheit' ? (temperature * 9) / 5 + 32 : temperature

  // 소수점 첫째 자리까지 반올림하여 반환
  return Number(convertedTemp.toFixed(1))
}

const displayTemp = computed(() => convertTemp(props.city.temp))

// 상태에 따라 카드의 배경 스타일을 동적으로 설정하는 computed 함수들입니다.
const weatherKindClass = computed(() => `weather-card--${getWeatherKind(props.city.status)}`)
const timeOfDayClass = computed(() => `weather-card--${props.city.timeOfDay ?? 'day'}`)
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${getWeatherBackground(props.city.status, props.city.timeOfDay)})`,
}))

// 이벤트를 부모 컴포넌트로 전달하기 위한 emit 정의
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article
    class="weather-card"
    :class="[weatherKindClass, timeOfDayClass, { 'weather-card--selected': selected }]"
    :style="backgroundStyle"
  >
    <!-- @click을 통해 선택 이벤트를 전달합니다. -->
    <button class="weather-card__summary" type="button" @click="emit('select-card')">
      <span class="weather-card__top">
        <span class="weather-card__location">
          <strong>{{ city.name }}</strong>
          <small>{{ dynamicLocalTime }}</small>
        </span>
        <span class="weather-card__temperature">
          <strong>{{ displayTemp }}</strong>
          <small>{{ configStore.unitSymbol }}</small>
        </span>
      </span>

      <span class="weather-card__bottom">
        <strong>{{ city.status }}</strong>
        <span v-if="city.temp >= 35" class="temperature-label temperature-label--very-hot">
          짱더움
        </span>
        <span v-else-if="city.temp >= 28" class="temperature-label temperature-label--hot">
          더움
        </span>
        <span v-else-if="city.temp >= 20" class="temperature-label temperature-label--mild">
          선선함
        </span>
        <span v-else-if="city.temp >= 10" class="temperature-label temperature-label--chilly">
          쌀쌀함
        </span>
        <span v-else-if="city.temp >= 0" class="temperature-label temperature-label--cold">
          추움
        </span>
        <span v-else class="temperature-label temperature-label--freezing">짱추움</span>
      </span>
    </button>

    <el-button class="weather-card__detail" text @click.stop="emit('click-detail')">
      상세보기
      <el-icon class="weather-card__detail-icon"><ArrowRight /></el-icon>
    </el-button>
  </article>
</template>

<style scoped>
.weather-card {
  position: relative;
  min-height: 12rem;
  border: 1px solid rgb(255 255 255 / 38%);
  border-radius: 1.15rem;
  background-position: 44% 50%;
  background-size: cover;
  box-shadow: 0 0.8rem 1.8rem rgb(8 46 76 / 18%);
  overflow: hidden;
  isolation: isolate;
  transition: transform var(--transition-fast);
  animation: weather-card-drift 34s ease-in-out infinite alternate;
}

.weather-card::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: rgb(8 54 92 / 48%);
  content: '';
}

.weather-card--cloudy::before {
  background: rgb(15 37 55 / 44%);
}

.weather-card--rain::before {
  background: rgb(6 23 45 / 52%);
}

.weather-card--night::before {
  background: rgb(4 15 36 / 38%);
}

.weather-card--night.weather-card--rain::before {
  background: rgb(2 10 25 / 48%);
}

.weather-card:hover {
  transform: translateY(-3px);
}

.weather-card--selected {
  border-color: #fff;
  box-shadow:
    0 0 0 3px var(--color-primary),
    0 0.8rem 1.8rem rgb(8 46 76 / 22%);
}

.weather-card button:focus-visible {
  outline: 3px solid var(--el-color-primary-light-7);
  outline-offset: 3px;
}

.weather-card__summary {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  min-height: 12rem;
  padding: 1.25rem;
  border: 0;
  background: transparent;
  color: #fff;
  font: inherit;
  text-align: left;
  cursor: pointer;
  text-shadow: 0 2px 8px rgb(0 24 48 / 42%);
}

.weather-card__top,
.weather-card__bottom {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
}

.weather-card__bottom {
  align-items: center;
  justify-content: flex-start;
  padding-right: 5.5rem;
}

.weather-card__location {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.weather-card__location strong {
  color: #fff;
  font-size: 1.45rem;
  font-weight: 750;
  letter-spacing: -0.04em;
}

.weather-card__location small {
  color: rgb(255 255 255 / 78%);
  font-size: 0.78rem;
  font-weight: 600;
}

.weather-card__temperature {
  white-space: nowrap;
}

.weather-card__temperature strong {
  color: #fff;
  font-size: 2.65rem;
  font-variant-numeric: tabular-nums;
  font-weight: 450;
  letter-spacing: -0.06em;
  line-height: 1;
}

.weather-card__temperature small {
  margin-left: 0.15rem;
  color: rgb(255 255 255 / 86%);
  font-size: 0.78rem;
  font-weight: 700;
  vertical-align: top;
}

.weather-card__bottom > strong {
  color: #fff;
  font-size: 0.96rem;
  font-weight: 700;
}

.temperature-label {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
  min-height: 1.7rem;
  padding: 0.2rem 0.65rem 0.2rem 0.5rem;
  border: 1px solid rgb(255 255 255 / 28%);
  border-radius: 999px;
  background: rgb(8 35 60 / 38%);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 750;
  line-height: 1;
  text-shadow: none;
  backdrop-filter: blur(8px);
}

.temperature-label::before {
  width: 0.48rem;
  height: 0.48rem;
  border: 1px solid rgb(255 255 255 / 55%);
  border-radius: 50%;
  background: var(--temperature-accent);
  box-shadow: 0 0 0.55rem var(--temperature-glow);
  content: '';
}

.temperature-label--very-hot {
  --temperature-accent: #ff5c4d;
  --temperature-glow: rgb(255 92 77 / 75%);
}

.temperature-label--hot {
  --temperature-accent: #ff9f43;
  --temperature-glow: rgb(255 159 67 / 70%);
}

.temperature-label--mild {
  --temperature-accent: #62e6b7;
  --temperature-glow: rgb(98 230 183 / 65%);
}

.temperature-label--chilly {
  --temperature-accent: #70d6ff;
  --temperature-glow: rgb(112 214 255 / 65%);
}

.temperature-label--cold {
  --temperature-accent: #78a8ff;
  --temperature-glow: rgb(120 168 255 / 70%);
}

.temperature-label--freezing {
  --temperature-accent: #c6b8ff;
  --temperature-glow: rgb(198 184 255 / 75%);
}

.weather-card__detail {
  position: absolute;
  right: 0.65rem;
  bottom: 0.55rem;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  --el-button-hover-bg-color: rgb(255 255 255 / 14%);
  --el-button-hover-text-color: #fff;
}

.weather-card__detail-icon {
  margin-left: 0.25rem;
}

@keyframes weather-card-drift {
  from {
    background-position: 42% 50%;
  }

  to {
    background-position: 58% 50%;
  }
}

@media (max-width: 36rem) {
  .weather-card__bottom {
    padding-right: 0;
  }
}
</style>
