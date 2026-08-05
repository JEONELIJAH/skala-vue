<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

const cities = [
  { id: 1, name: '서울', temp: 24 },
  { id: 2, name: '수원', temp: 22 },
  { id: 3, name: '부산', temp: 26 },
]

const selectedCity = ref(null)
const eventLog = ref('자식의 emit을 기다리고 있습니다.')

const handleCitySelect = (city) => {
  selectedCity.value = city
  eventLog.value = `부모가 select-city 이벤트와 ${city.name} 데이터를 받았습니다.`
}
</script>

<template>
  <div class="props-emits-demo">
    <section>
      <header>
        <span>Parent → Child</span>
        <h3>Props 전달</h3>
      </header>

      <div class="city-options">
        <PropsEmitsChild
          v-for="city in cities"
          :key="city.id"
          :city="city"
          :selected="selectedCity?.id === city.id"
          @select-city="handleCitySelect"
        />
      </div>
    </section>

    <section class="event-result">
      <header>
        <span>Child → Parent</span>
        <h3>Emit 수신</h3>
      </header>

      <strong>{{ selectedCity?.name || '선택 없음' }}</strong>
      <p>{{ eventLog }}</p>
      <code>@select-city="handleCitySelect"</code>
    </section>
  </div>
</template>

<style scoped>
.props-emits-demo {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.8rem;
}

.props-emits-demo > section {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  background: rgb(7 48 88 / 24%);
}

.props-emits-demo header span {
  color: var(--color-primary);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.props-emits-demo h3 {
  margin: 0.15rem 0 0.75rem;
  font-size: 1rem;
}

.city-options {
  display: grid;
  gap: 0.45rem;
}

.event-result {
  display: flex;
  flex-direction: column;
}

.event-result > strong {
  margin-top: auto;
  font-size: 2rem;
}

.event-result p {
  margin-top: 0.35rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.event-result code {
  margin-top: auto;
  padding-top: 1rem;
  color: #9ee6ff;
  font-size: 0.72rem;
}

@media (max-width: 42rem) {
  .props-emits-demo {
    grid-template-columns: 1fr;
  }
}
</style>
