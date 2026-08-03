<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

const updateSearchQuery = (event) => {
  searchQuery.value = event.currentTarget.value
}

const selectCity = (city) => {
  selectedCityInfo.value = city
}

const showDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}
</script>

<template>
  <main class="weather-mockup">
    <h1>🌤️ 과제 1: 날씨 (Mockup)</h1>

    <section class="dashboard-box" aria-labelledby="search-title">
      <h2 id="search-title">🔍 도시 검색</h2>

      <label for="city-search">검색할 도시 이름</label>
      <input
        id="city-search"
        type="search"
        :value="searchQuery"
        placeholder="예: 수원"
        autocomplete="off"
        @input="updateSearchQuery"
      />

      <p class="search-status" aria-live="polite">
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="dashboard-box" aria-labelledby="weather-title">
      <h2 id="weather-title">🌆 지역별 날씨 현황</h2>

      <ul class="weather-list">
        <li
          v-for="city in weatherList"
          :key="city.id"
          class="weather-list__item"
          @click="selectCity(city)"
        >
          <article
            class="weather-card"
            :class="{ 'weather-card--selected': selectedCityInfo?.id === city.id }"
          >
            <button
              class="weather-card__summary"
              type="button"
              :aria-pressed="selectedCityInfo?.id === city.id"
            >
              <strong>{{ city.name }} ({{ city.status }})</strong>
              <span>현재 기온: {{ city.temp }}°C</span>

              <span v-if="city.temp >= 25" class="temperature-label temperature-label--hot">
                🔥 더움 (25도 이상)
              </span>
              <span v-else class="temperature-label temperature-label--cool">
                ❄️ 선선함 (25도 미만)
              </span>
            </button>

            <button
              class="weather-card__detail"
              type="button"
              :aria-label="`${city.name} 날씨 상세보기`"
              @click.stop="showDetail(city)"
            >
              상세보기
            </button>
          </article>
        </li>
      </ul>
    </section>

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
  width: min(100%, 44rem);
  margin: 2rem auto;
}

.weather-mockup h1 {
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
}

.dashboard-box {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-background-soft);
}

.dashboard-box h2 {
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
}

.dashboard-box label {
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

.dashboard-box input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border-hover);
  border-radius: 0.4rem;
  background: var(--color-background);
  color: var(--color-text);
  font: inherit;
}

.dashboard-box input:focus-visible,
.weather-card button:focus-visible {
  outline: 3px solid rgb(66 184 131 / 35%);
  outline-offset: 2px;
}

.search-status {
  min-height: 1.5rem;
  margin-top: 0.5rem;
}

.weather-list {
  display: grid;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.weather-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.6rem;
  background: var(--color-background);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.weather-card--selected {
  border-color: #2f855a;
  box-shadow: 0 0 0 3px rgb(47 133 90 / 15%);
}

.weather-card__summary {
  display: grid;
  justify-items: start;
  gap: 0.25rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.weather-card__summary strong {
  font-weight: 700;
}

.weather-card__detail {
  padding: 0.55rem 0.75rem;
  border: 1px solid var(--color-border-hover);
  border-radius: 0.4rem;
  background: var(--color-background);
  color: inherit;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.temperature-label {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.2rem 0.45rem;
  border-radius: 0.35rem;
  color: white;
  font-size: 0.8rem;
  font-weight: 700;
}

.temperature-label--hot {
  background: #e53e3e;
}

.temperature-label--cool {
  background: #3182ce;
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

@media (max-width: 36rem) {
  .weather-card {
    grid-template-columns: 1fr;
  }

  .weather-card__detail {
    width: 100%;
  }
}
</style>
