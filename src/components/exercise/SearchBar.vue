<script setup>
import BaseDashboardCard from './BaseDashboardCard.vue'
import { onBeforeUpdate, onUpdated } from 'vue';
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const updateQuery = (event) => {
  emit('update-query', event.currentTarget.value.trim())
}

const log = (hook) => {
  console.log(`[WeatherChild] ${hook}`)
}

onBeforeUpdate(() => log('onBeforeUpdate'))
onUpdated(() => log('onUpdated'))
</script>

<template>
  <BaseDashboardCard>
    <h2 id="search-title">🔍 도시 검색</h2>

    <label for="city-search">검색할 도시 이름</label>
    <input
      id="city-search"
      type="search"
      :value="query"
      placeholder="예: 수원"
      autocomplete="off"
      @input="updateQuery"
    />

    <p class="search-status" aria-live="polite">
      검색 중인 도시: <strong>{{ query }}</strong>
    </p>
  </BaseDashboardCard>
</template>

<style scoped>
.dashboard-box :deep(h2) {
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
  font-weight: 700;
}

label {
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 600;
}

input {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border-hover);
  border-radius: 0.4rem;
  background: var(--color-background);
  color: var(--color-text);
  font: inherit;
}

input:focus-visible {
  outline: 3px solid rgb(66 184 131 / 35%);
  outline-offset: 2px;
}

.search-status {
  min-height: 1.5rem;
  margin-top: 0.5rem;
}
</style>
