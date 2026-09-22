<script setup>
import { computed } from 'vue'
import { shortDate, formatNumber } from '@/utils/uljinWeather'

const props = defineProps({
  days: { type: Array, required: true },
  metric: { type: String, required: true },
  unit: { type: String, required: true },
  fahrenheit: Boolean,
  selected: { type: String, default: '' },
})
const emit = defineEmits(['select'])
const convert = (value) =>
  !Number.isFinite(value)
    ? null
    : props.metric === 'temperature' && props.fahrenheit
      ? (value * 9) / 5 + 32
      : value
const values = computed(() => props.days.map((day) => convert(day[props.metric])))
const bounds = computed(() => {
  const valid = values.value.filter(Number.isFinite)
  if (!valid.length) return { min: 0, max: 1 }
  const min = props.metric === 'temperature' ? Math.floor(Math.min(...valid) - 2) : 0
  const max =
    props.metric === 'humidity'
      ? 100
      : Math.ceil(Math.max(...valid) + (props.metric === 'temperature' ? 2 : 1))
  return { min, max: Math.max(max, min + 1) }
})
const x = (index) => 48 + ((index + 0.5) * 804) / Math.max(props.days.length, 1)
const y = (value) =>
  216 - ((value - bounds.value.min) / (bounds.value.max - bounds.value.min)) * 180
const path = computed(() => {
  let connected = false
  return values.value
    .map((value, index) => {
      if (value === null) {
        connected = false
        return ''
      }
      const command = `${connected ? 'L' : 'M'}${x(index)},${y(value)}`
      connected = true
      return command
    })
    .join(' ')
})
const ticks = computed(() =>
  Array.from(
    { length: 5 },
    (_, i) => bounds.value.min + ((bounds.value.max - bounds.value.min) * i) / 4,
  ),
)
const labelStep = computed(() => Math.max(1, Math.ceil(props.days.length / 7)))
</script>

<template>
  <div class="trend-chart">
    <svg viewBox="0 0 880 260" role="img">
      <title>
        울진 날짜별
        {{
          metric === 'temperature'
            ? '평균 기온'
            : metric === 'precipitation'
              ? '관측 강수량 합계'
              : metric === 'humidity'
                ? '평균 습도'
                : '평균 풍속'
        }}. 정확한 값은 아래 날짜 선택과 기록 표에서 확인할 수 있습니다.
      </title>
      <g v-for="tick in ticks" :key="tick">
        <line x1="48" x2="852" :y1="y(tick)" :y2="y(tick)" class="grid-line" />
        <text x="35" :y="y(tick) + 4" text-anchor="end">{{ formatNumber(tick) }}</text>
      </g>
      <path v-if="metric !== 'precipitation'" :d="path" class="trend-line" />
      <g v-for="(day, index) in days" :key="day.date" @click="emit('select', day.date)">
        <rect
          :x="x(index) - 402 / days.length"
          y="25"
          :width="804 / days.length"
          height="205"
          class="hit-area"
          :class="{ selected: selected === day.date }"
        />
        <template v-if="values[index] !== null">
          <rect
            v-if="metric === 'precipitation'"
            :x="x(index) - Math.min(11, 250 / days.length)"
            :y="y(values[index])"
            :width="Math.min(22, 500 / days.length)"
            :height="Math.max(2, 216 - y(values[index]))"
            rx="3"
            class="rain-bar"
          />
          <circle
            v-else
            :cx="x(index)"
            :cy="y(values[index])"
            :r="selected === day.date ? 6 : 3.5"
            class="trend-point"
          />
        </template>
        <text
          v-if="index % labelStep === 0 || index === days.length - 1"
          :x="x(index)"
          y="249"
          text-anchor="middle"
        >
          {{ shortDate(day.date) }}
        </text>
        <title>{{ day.date }} · {{ formatNumber(values[index]) }}{{ unit }}</title>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.trend-chart {
  width: 100%;
  overflow-x: auto;
}
svg {
  display: block;
  width: 100%;
  min-width: 520px;
}
text {
  fill: #c5dce9;
  font-size: 12px;
  font-family: inherit;
}
.grid-line {
  stroke: rgb(232 246 255 / 13%);
  stroke-dasharray: 3 5;
}
.trend-line {
  stroke: #bdeaff;
  stroke-width: 3;
  stroke-linejoin: round;
  stroke-linecap: round;
  fill: none;
}
.trend-point {
  fill: #e1f5ff;
  stroke: #336a90;
  stroke-width: 2;
  pointer-events: none;
}
.rain-bar {
  fill: #9eddfb;
  pointer-events: none;
}
.hit-area {
  fill: transparent;
  cursor: pointer;
}
.hit-area:hover,
.hit-area.selected {
  fill: rgb(255 255 255 / 7%);
}
</style>
