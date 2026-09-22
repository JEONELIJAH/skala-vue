<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import {
  ArrowRight,
  Download,
  RefreshRight,
  Location,
  WindPower,
  Drizzling,
  Sunny,
  MostlyCloudy,
} from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/configStore'
import UljinTrendChart from '@/components/weather/UljinTrendChart.vue'
import { getWeatherBackground } from '@/utils/weatherVisuals'
import { dailyWeather, koreaToday, shiftDate, shortDate, formatNumber } from '@/utils/uljinWeather'

const config = useConfigStore()
const to = ref(koreaToday())
const from = ref(shiftDate(to.value, -27))
const appliedRange = ref({ from: from.value, to: to.value })
const observations = ref([])
const loading = ref(false)
const error = ref('')
const metric = ref('temperature')
const selectedDate = ref('')
const custom = ref(false)
const activePeriod = ref(28)
const trendSection = ref(null)
const ranges = new Map()
let requestNumber = 0

const temperature = (value) =>
  !Number.isFinite(value) ? null : config.unit === 'fahrenheit' ? (value * 9) / 5 + 32 : value
const tempText = (value) => formatNumber(temperature(value))
const days = computed(() =>
  dailyWeather(observations.value, appliedRange.value.from, appliedRange.value.to),
)
const latest = computed(() => observations.value.at(-1))
const selected = computed(() => days.value.find((day) => day.date === selectedDate.value))
const metrics = computed(() => [
  { key: 'temperature', label: '기온', unit: config.unitSymbol },
  { key: 'precipitation', label: '강수량', unit: 'mm' },
  { key: 'humidity', label: '습도', unit: '%' },
  { key: 'windSpeed', label: '바람', unit: 'm/s' },
])
const currentMetric = computed(() => metrics.value.find((item) => item.key === metric.value))
const summary = computed(() => {
  const temperatures = observations.value.map((row) => row.temperature).filter(Number.isFinite)
  const rain = observations.value.map((row) => row.precipitation).filter(Number.isFinite)
  return {
    mean: temperatures.length
      ? temperatures.reduce((sum, value) => sum + value, 0) / temperatures.length
      : null,
    low: temperatures.length ? Math.min(...temperatures) : null,
    high: temperatures.length ? Math.max(...temperatures) : null,
    rain: rain.length ? rain.reduce((sum, value) => sum + value, 0) : null,
  }
})
const conditions = computed(() => {
  if (!latest.value) return { label: '관측자료 없음', icon: MostlyCloudy }
  if (latest.value.precipitation > 0) return { label: '강수 관측', icon: Drizzling }
  const clouds = latest.value.cloudCover
  if (clouds === null) return { label: '기상청 지상관측', icon: Location }
  return clouds >= 6
    ? { label: clouds >= 9 ? '흐린 하늘' : '구름 많은 하늘', icon: MostlyCloudy }
    : { label: clouds >= 3 ? '구름 조금' : '맑은 하늘', icon: Sunny }
})
const isCurrent = computed(() => appliedRange.value.to === koreaToday())
const heroBackground = computed(() => {
  const hour = Number(latest.value?.time.slice(11, 13))
  return getWeatherBackground(
    conditions.value.label === '강수 관측' ? '비' : conditions.value.label.replace('흐린', '흐림'),
    hour >= 6 && hour < 18 ? 'day' : 'night',
  )
})
const stale = computed(
  () => isCurrent.value && latest.value && Date.now() - Date.parse(latest.value.time) > 3 * 3600000,
)
const metricText = (day) =>
  metric.value === 'temperature' ? tempText(day?.temperature) : formatNumber(day?.[metric.value])

async function load(force = false) {
  const request = ++requestNumber
  const key = `${from.value}:${to.value}`
  const start = Date.parse(`${from.value}T00:00:00+09:00`)
  const end = Date.parse(`${to.value}T00:00:00+09:00`)
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end < start ||
    (end - start) / 86400000 >= 31 ||
    to.value > koreaToday()
  ) {
    error.value = '오늘까지의 기간을 최대 31일 이내로 선택해 주세요.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    let saved = ranges.get(key)
    if (force || !saved || Date.now() - saved.time > 600000) {
      const { data } = await axios.get('/api/uljin-weather', {
        params: { from: from.value, to: to.value },
        timeout: 25000,
      })
      saved = { data, time: Date.now() }
      ranges.set(key, saved)
    }
    if (request !== requestNumber) return
    observations.value = saved.data.observations
    appliedRange.value = saved.data.range
    selectedDate.value = saved.data.observations.at(-1)?.time.slice(0, 10) || saved.data.range.to
  } catch (cause) {
    if (request === requestNumber)
      error.value =
        cause.response?.data?.error || '관측자료를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    if (request === requestNumber) loading.value = false
  }
}

function choosePeriod(period) {
  activePeriod.value = period
  custom.value = false
  to.value = koreaToday()
  from.value = shiftDate(to.value, 1 - period)
  load()
}

function applyCustomRange() {
  activePeriod.value = 0
  load()
}

function showDay(date) {
  selectedDate.value = date
  trendSection.value?.scrollIntoView({ block: 'start' })
}

function downloadCsv() {
  const header =
    '관측시각(KST),기온(섭씨),습도(%),풍속(m/s),강수량(mm),강수집계시간(h),해면기압(hPa)'
  const lines = observations.value.map((row) =>
    [
      row.time,
      row.temperature,
      row.humidity,
      row.windSpeed,
      row.precipitation,
      row.rainPeriodHours,
      row.pressure,
    ].join(','),
  )
  const url = URL.createObjectURL(
    new Blob(['\uFEFF' + [header, ...lines].join('\n')], { type: 'text/csv;charset=utf-8' }),
  )
  const link = document.createElement('a')
  link.href = url
  link.download = `uljin-${appliedRange.value.from}-${appliedRange.value.to}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => load())
</script>

<template>
  <main class="uljin-board">
    <header class="board-heading">
      <div>
        <p class="eyebrow">ULJIN WEATHER JOURNAL</p>
        <h1>울진의 날씨 기록</h1>
        <p class="intro">지난 몇 주의 변화부터 가장 최근 관측까지.</p>
      </div>
      <span class="source-chip"
        ><el-icon><Location /></el-icon> 기상청 · 울진 130</span
      >
    </header>

    <section class="period-panel">
      <div class="period-top">
        <div class="period-buttons">
          <button
            v-for="period in [7, 14, 28]"
            :key="period"
            :class="{ active: !custom && activePeriod === period }"
            :disabled="loading"
            @click="choosePeriod(period)"
          >
            최근 {{ period }}일</button
          ><button :class="{ active: custom }" :disabled="loading" @click="custom = !custom">
            직접 선택
          </button>
        </div>
        <button class="refresh-button" :disabled="loading" @click="load(true)">
          <el-icon :class="{ spinning: loading }"><RefreshRight /></el-icon
          >{{ loading ? '불러오는 중' : '새로고침' }}
        </button>
      </div>
      <form v-if="custom" class="date-form" @submit.prevent="applyCustomRange">
        <label>시작일<input v-model="from" type="date" :max="to" required /></label><span>—</span
        ><label
          >종료일<input v-model="to" type="date" :min="from" :max="koreaToday()" required /></label
        ><button class="apply-button" :disabled="loading">조회하기</button
        ><small>한 번에 최대 31일</small>
      </form>
      <p class="range-caption">
        {{ appliedRange.from.replaceAll('-', '.') }} — {{ appliedRange.to.replaceAll('-', '.') }}
        <span>한국 표준시 · 시간별 관측</span>
      </p>
    </section>

    <div v-if="error" class="notice error">
      <p>{{ error }}</p>
      <small v-if="observations.length"
        >아래에는 마지막으로 불러온 기간의 자료를 유지하고 있습니다.</small
      >
    </div>
    <div v-if="loading && !observations.length" class="loading-panel">
      <el-icon class="spinning"><RefreshRight /></el-icon>
      <h2>울진의 날씨를 모으고 있어요</h2>
      <p>기상청의 시간별 관측기록을 불러옵니다.</p>
    </div>
    <template v-else-if="observations.length">
      <section class="weather-hero" :style="{ '--hero-image': `url(${heroBackground})` }">
        <div class="hero-main">
          <p class="eyebrow">{{ isCurrent ? '가장 최근 관측' : '선택 기간 마지막 관측' }}</p>
          <h2>경상북도 울진</h2>
          <div class="hero-temperature">
            {{ tempText(latest.temperature) }}<span>{{ config.unitSymbol }}</span>
          </div>
          <p class="condition">
            <el-icon><component :is="conditions.icon" /></el-icon>{{ conditions.label }}
          </p>
          <p class="observation-time">
            {{ latest.time.slice(0, 16).replace('T', ' ') }} 관측
            <span v-if="stale">· 최신 자료 지연</span>
          </p>
        </div>
        <div class="hero-aside">
          <div>
            <el-icon><WindPower /></el-icon><span>바람</span
            ><strong>{{ formatNumber(latest.windSpeed) }}<small> m/s</small></strong>
          </div>
          <div>
            <el-icon><Drizzling /></el-icon><span>습도</span
            ><strong>{{ formatNumber(latest.humidity, 0) }}<small> %</small></strong>
          </div>
          <div>
            <span>{{ latest.rainPeriodHours }}시간 강수</span
            ><strong>{{ formatNumber(latest.precipitation) }}<small> mm</small></strong>
          </div>
        </div>
      </section>

      <section class="summary-grid">
        <div>
          <p>기간 평균 기온</p>
          <strong
            >{{ tempText(summary.mean) }}<small>{{ config.unitSymbol }}</small></strong
          ><span>유효한 시간 관측값의 평균</span>
        </div>
        <div>
          <p>기온의 범위</p>
          <strong
            >{{ tempText(summary.low) }}<small> — </small>{{ tempText(summary.high)
            }}<small>{{ config.unitSymbol }}</small></strong
          ><span>시간 관측 최저 · 최고</span>
        </div>
        <div>
          <p>기간 강수량</p>
          <strong>{{ formatNumber(summary.rain) }}<small> mm</small></strong
          ><span>보고된 강수 관측값 합계</span>
        </div>
      </section>

      <section ref="trendSection" class="journal-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">THE PAST FEW WEEKS</p>
            <h2>날씨의 흐름</h2>
          </div>
          <span class="subtle">{{ days.length }}일간의 기록</span>
        </div>
        <div class="metric-tabs">
          <button
            v-for="item in metrics"
            :key="item.key"
            :class="{ active: metric === item.key }"
            @click="metric = item.key"
          >
            {{ item.label }}<small>{{ item.unit }}</small>
          </button>
        </div>
        <div class="chart-readout">
          <div>
            <label for="observation-day">날짜 선택</label
            ><select id="observation-day" v-model="selectedDate">
              <option v-for="day in days" :key="day.date" :value="day.date">
                {{ day.date }}{{ day.date === koreaToday() ? ' · 오늘' : '' }}
              </option>
            </select>
          </div>
          <p>
            <span>{{ metric === 'precipitation' ? '관측 합계' : '시간 관측 평균' }}</span
            ><strong
              >{{ metricText(selected) }}<small>{{ currentMetric.unit }}</small></strong
            >
          </p>
        </div>
        <UljinTrendChart
          :days="days"
          :metric="metric"
          :unit="currentMetric.unit"
          :fahrenheit="config.unit === 'fahrenheit'"
          :selected="selectedDate"
          @select="selectedDate = $event"
        />
        <p class="chart-note">
          그래프의 날짜를 누르면 시간별 기록이 열립니다. 빈 구간은 관측자료가 없는 구간입니다.
        </p>

        <div v-if="selected" class="hourly-section">
          <div class="hourly-heading">
            <h3>{{ shortDate(selected.date) }} 시간별 기록</h3>
            <span
              >{{ selected.rows.length }}개 관측{{
                selected.date === koreaToday() ? ' · 오늘 집계 중' : ''
              }}</span
            >
          </div>
          <div v-if="selected.rows.length" class="hourly-strip">
            <div v-for="row in selected.rows" :key="row.time">
              <span>{{ row.time.slice(11, 16) }}</span
              ><strong
                >{{
                  metric === 'temperature' ? tempText(row.temperature) : formatNumber(row[metric])
                }}<small>{{ currentMetric.unit }}</small></strong
              >
            </div>
          </div>
          <p v-else class="chart-note">이 날짜에 제공된 관측자료가 없습니다.</p>
        </div>
      </section>

      <section class="journal-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">DAILY RECORDS</p>
            <h2>날짜별로 살펴보기</h2>
          </div>
          <button class="export-button" @click="downloadCsv">
            <el-icon><Download /></el-icon>시간별 CSV
          </button>
        </div>
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>날짜</th>
                <th>평균 기온</th>
                <th>최저 / 최고</th>
                <th>강수 합계</th>
                <th>평균 습도</th>
                <th>평균 풍속</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="day in [...days].reverse()"
                :key="day.date"
                :class="{ 'selected-row': selectedDate === day.date }"
              >
                <th>
                  <button class="day-button" @click="showDay(day.date)">
                    {{ shortDate(day.date) }}<el-icon><ArrowRight /></el-icon></button
                  ><small>{{
                    day.date === koreaToday() ? '집계 중' : day.incomplete ? '일부 자료' : ''
                  }}</small>
                </th>
                <td>{{ tempText(day.temperature) }}{{ config.unitSymbol }}</td>
                <td>
                  <span class="low-temp">{{ tempText(day.low) }}</span
                  ><span class="divider"> / </span>{{ tempText(day.high) }}{{ config.unitSymbol }}
                </td>
                <td>
                  {{ formatNumber(day.precipitation) }} mm<small v-if="day.rainIncomplete"
                    >일부 관측</small
                  >
                </td>
                <td>{{ formatNumber(day.humidity, 0) }}%</td>
                <td>{{ formatNumber(day.windSpeed) }} m/s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
    <section v-else-if="!loading && !error" class="loading-panel">
      <h2>이 기간에는 관측자료가 없습니다</h2>
      <p>다른 기간을 선택해 주세요.</p>
    </section>

    <footer class="data-notes">
      <p>
        자료 출처
        <a href="https://apihub.kma.go.kr/" target="_blank" rel="noopener noreferrer"
          >기상청 API허브</a
        >
        · 종관기상관측(ASOS), 울진 지점 130
      </p>
      <p>
        기온 최저·최고와 평균은 이 화면의 시간 관측값으로 계산하며, 공식 일 통계와 다를 수 있습니다.
        오늘은 마지막 관측 시각까지만 집계합니다.
      </p>
      <p>
        강수량은 4–10월 1시간, 11–3월 3시간 간격 자료를 사용합니다. 결측은 ‘—’로 표시하며, 일부 관측
        합계는 하루 전체 강수량이 아닙니다. 캐시를 사용하므로 새로고침해도 최신 관측이 즉시 반영되지
        않을 수 있습니다.
      </p>
    </footer>
  </main>
</template>

<style scoped>
.uljin-board {
  width: 100%;
  max-width: var(--content-width, 60rem);
  margin: 2.5rem auto 4rem;
  color: #ecf7ff;
}
.board-heading,
.section-heading,
.period-top,
.hourly-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.board-heading {
  margin-bottom: 1.75rem;
  align-items: end;
}
.eyebrow {
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: #bddbeb;
  margin-bottom: 0.55rem;
}
h1 {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  letter-spacing: -0.045em;
  line-height: 1.2;
}
.intro {
  color: #d2e5ef;
  font-size: 0.88rem;
  margin-top: 0.7rem;
}
.source-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  white-space: nowrap;
  font-size: 0.73rem;
  color: #d7eaf5;
  padding: 0.55rem 0.8rem;
  border: 1px solid #ffffff30;
  border-radius: 2rem;
}
button,
input,
select {
  font: inherit;
}
button {
  cursor: pointer;
}
button:disabled {
  opacity: 0.55;
  cursor: wait;
}
.period-panel {
  margin-bottom: 1.2rem;
}
.period-buttons {
  display: flex;
  padding: 0.25rem;
  border-radius: 0.9rem;
  background: rgb(17 52 87 / 25%);
  border: 1px solid #ffffff20;
}
.period-buttons button,
.refresh-button,
.metric-tabs button,
.export-button {
  border: 0;
  background: transparent;
  color: #d2e5ef;
  border-radius: 0.65rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 160ms;
}
.period-buttons button.active,
.metric-tabs button.active {
  background: #e4f3fc;
  color: #19446b;
  box-shadow: 0 2px 8px #132e4020;
}
button:hover:not(:disabled):not(.active) {
  background: #ffffff16;
}
.refresh-button,
.export-button {
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
}
.range-caption {
  font-size: 0.73rem;
  margin: 0.8rem 0.15rem 0;
  color: #c1d8e7;
  display: flex;
  gap: 0.85rem;
}
.range-caption span {
  color: #b1cfdf;
}
.date-form {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1rem;
}
.date-form label {
  display: grid;
  gap: 0.3rem;
  font-size: 0.73rem;
}
.date-form input,
select {
  color-scheme: dark;
  border: 1px solid #ffffff30;
  border-radius: 0.6rem;
  background: #244f76;
  color: #f2faff;
  padding: 0.5rem 0.7rem;
}
.apply-button {
  border: 0;
  border-radius: 0.6rem;
  padding: 0.55rem 0.85rem;
  color: #164064;
  background: #e4f3fc;
}
.date-form small {
  color: #c1d8e7;
  padding: 0.5rem;
}
.weather-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.1rem 2.25rem;
  border: 1px solid #ffffff40;
  border-radius: 1.5rem;
  background: #376f9c;
  box-shadow: 0 16px 45px #12365720;
}
.weather-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(90deg, #164b799c, #21578030),
    var(--hero-image) center 40% / cover;
  opacity: 0.75;
}
.hero-main h2 {
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}
.hero-temperature {
  font-size: clamp(3.7rem, 9vw, 5.3rem);
  font-weight: 300;
  letter-spacing: -0.07em;
  line-height: 1.2;
  margin-top: 0.4rem;
  font-variant-numeric: tabular-nums;
}
.hero-temperature > span {
  vertical-align: top;
  display: inline-block;
  font-size: 1.5rem;
  letter-spacing: -0.02em;
  margin: 1rem 0 0 0.4rem;
}
.condition {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  margin-top: 0.2rem;
  font-size: 0.95rem;
}
.observation-time {
  margin-top: 1.15rem;
  color: #d7e8f1;
  font-size: 0.72rem;
}
.hero-aside {
  width: 30%;
  min-width: 150px;
  padding-left: 1.5rem;
  border-left: 1px solid #ffffff30;
}
.hero-aside > div {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 0;
}
.hero-aside span {
  font-size: 0.8rem;
}
.hero-aside strong {
  margin-left: auto;
  font-size: 1.4rem;
  font-weight: 500;
}
.hero-aside small {
  font-size: 0.7rem;
  font-weight: 400;
}
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr 1fr;
  gap: 0.9rem;
  margin: 1rem 0 1.5rem;
}
.summary-grid > div,
.journal-panel {
  background: rgb(28 71 110 / 43%);
  border: 1px solid #ffffff26;
  backdrop-filter: blur(18px);
  border-radius: 1.1rem;
}
.summary-grid > div {
  padding: 1.2rem;
}
.summary-grid p {
  color: #d0e5f0;
  font-size: 0.76rem;
}
.summary-grid strong {
  display: block;
  font-size: clamp(1.25rem, 2.8vw, 1.9rem);
  font-weight: 500;
  margin: 0.5rem 0 0.35rem;
  letter-spacing: -0.03em;
}
.summary-grid strong small {
  font-size: 0.75rem;
  color: #d4e8f3;
}
.summary-grid > div > span {
  font-size: 0.64rem;
  color: #b8d2e4;
}
.journal-panel {
  margin-bottom: 1.25rem;
  padding: 1.6rem;
}
.section-heading {
  margin-bottom: 1.3rem;
}
.section-heading h2 {
  font-size: 1.15rem;
  letter-spacing: -0.03em;
}
.subtle {
  color: #bdd6e5;
  font-size: 0.72rem;
}
.metric-tabs {
  display: flex;
  gap: 0.35rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #ffffff20;
}
.metric-tabs button {
  padding: 0.5rem 1rem;
}
.metric-tabs small {
  margin-left: 0.4rem;
  opacity: 0.7;
  font-size: 0.63rem;
}
.chart-readout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: 1.3rem 0 0.5rem;
}
.chart-readout label {
  display: block;
  font-size: 0.67rem;
  color: #c1d8e7;
  margin-bottom: 0.3rem;
}
.chart-readout select {
  font-size: 0.8rem;
}
.chart-readout p {
  display: flex;
  align-items: baseline;
  gap: 0.65rem;
}
.chart-readout p > span {
  color: #c1d8e7;
  font-size: 0.72rem;
}
.chart-readout strong {
  font-weight: 500;
  font-size: 1.8rem;
}
.chart-readout small {
  font-size: 0.8rem;
  margin-left: 0.15rem;
}
.chart-note {
  color: #b7d1e2;
  font-size: 0.7rem;
  margin-top: 0.65rem;
}
.hourly-section {
  margin-top: 1.5rem;
  padding-top: 1.1rem;
  border-top: 1px solid #ffffff20;
}
.hourly-heading h3 {
  font-size: 0.82rem;
  font-weight: 600;
}
.hourly-heading span {
  color: #bad4e5;
  font-size: 0.68rem;
}
.hourly-strip {
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding: 0.85rem 0 0.5rem;
  scrollbar-width: thin;
}
.hourly-strip > div {
  min-width: 79px;
  padding: 0.75rem 0.6rem;
  border-radius: 0.7rem;
  background: #ffffff08;
  text-align: center;
}
.hourly-strip span {
  display: block;
  color: #bfd7e7;
  font-size: 0.65rem;
  margin-bottom: 0.55rem;
}
.hourly-strip strong {
  white-space: nowrap;
  font-size: 0.95rem;
  font-weight: 500;
}
.hourly-strip small {
  font-size: 0.57rem;
  margin-left: 0.1rem;
}
.table-scroll {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
  font-size: 0.79rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
th,
td {
  padding: 0.85rem 0.65rem;
  border-bottom: 1px solid #ffffff12;
}
thead th {
  color: #bcd7e7;
  font-size: 0.68rem;
  font-weight: 500;
}
th:first-child {
  text-align: left;
}
tbody th {
  font-weight: 500;
}
td small,
tbody th > small {
  display: block;
  font-size: 0.6rem;
  color: #b5d0e2;
}
.selected-row {
  background: #ffffff08;
}
.day-button {
  border: 0;
  background: none;
  color: #edf8ff;
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  padding: 0.15rem 0;
}
.day-button .el-icon {
  opacity: 0.5;
  font-size: 0.65rem;
}
.low-temp {
  color: #afdfff;
}
.divider {
  color: #90b8d0;
}
.data-notes {
  padding: 0.4rem 0.15rem;
  font-size: 0.68rem;
  line-height: 1.85;
  color: #c0d7e5;
}
.data-notes p + p {
  margin-top: 0.35rem;
}
.data-notes a {
  color: #e5f4ff;
  text-decoration: underline;
}
.notice,
.loading-panel {
  padding: 2rem;
  margin: 1rem 0;
  border: 1px solid #ffffff35;
  border-radius: 1.1rem;
  background: #244e7399;
}
.error {
  color: #ffdfcd;
}
.notice small {
  display: block;
  margin-top: 0.5rem;
  color: #d0e2ee;
}
.loading-panel {
  text-align: center;
  padding: 4rem 1rem;
}
.loading-panel h2 {
  font-size: 1.1rem;
  margin: 0.8rem 0;
}
.loading-panel p {
  font-size: 0.8rem;
  color: #c2dcea;
}
.spinning {
  animation: spin 1.5s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 640px) {
  .uljin-board {
    margin-top: 1.6rem;
  }
  .board-heading {
    display: block;
  }
  .source-chip {
    width: fit-content;
    margin-top: 1rem;
  }
  .period-top {
    gap: 0.35rem;
    align-items: start;
  }
  .period-buttons {
    flex-wrap: wrap;
  }
  .period-buttons button {
    padding: 0.5rem 0.6rem;
    font-size: 0.7rem;
  }
  .refresh-button {
    padding: 0.6rem 0.3rem;
    white-space: nowrap;
    font-size: 0.67rem;
  }
  .range-caption {
    flex-direction: column;
    gap: 0.15rem;
  }
  .weather-hero {
    padding: 1.5rem;
    align-items: start;
    flex-direction: column;
    gap: 1rem;
  }
  .hero-aside {
    display: flex;
    gap: 0.5rem;
    width: 100%;
    padding: 0.9rem 0 0;
    border-left: 0;
    border-top: 1px solid #ffffff30;
  }
  .hero-aside > div {
    flex: 1;
    display: block;
    padding: 0;
  }
  .hero-aside .el-icon {
    display: none;
  }
  .hero-aside strong {
    display: block;
    font-size: 1.2rem;
    margin-top: 0.2rem;
  }
  .hero-aside span {
    font-size: 0.68rem;
  }
  .summary-grid {
    gap: 0.45rem;
    grid-template-columns: 1fr 1fr;
  }
  .summary-grid > div {
    padding: 0.9rem 0.7rem;
  }
  .summary-grid > div:nth-child(2) {
    grid-column: 1 / -1;
    grid-row: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .summary-grid > div:nth-child(2) > span {
    display: none;
  }
  .summary-grid strong {
    font-size: 1.35rem;
  }
  .journal-panel {
    padding: 1rem;
  }
  .section-heading .eyebrow {
    font-size: 0.56rem;
  }
  .metric-tabs {
    gap: 0.1rem;
  }
  .metric-tabs button {
    flex: 1;
    padding: 0.5rem 0.4rem;
    font-size: 0.75rem;
  }
  .metric-tabs small {
    display: none;
  }
  .chart-readout p {
    display: block;
    text-align: right;
  }
  .chart-readout p > span {
    display: block;
  }
  .chart-readout strong {
    font-size: 1.5rem;
  }
  .export-button {
    font-size: 0.7rem;
    padding: 0.4rem;
  }
}
</style>
