<script setup>
import BaseDashboardCard from './BaseDashboardCard.vue'
import { onBeforeUpdate, onUpdated } from 'vue'
defineProps({
  query: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update-query'])

const updateQuery = (value) => {
  emit('update-query', value.trim())
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
    <el-input
      id="city-search"
      :model-value="query"
      size="large"
      placeholder="검색할 도시 이름 입력"
      autocomplete="off"
      clearable
      @input="updateQuery"
    >
      <template #prefix><span aria-hidden="true">🔎</span></template>
    </el-input>

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

.search-status {
  min-height: 1.5rem;
  margin-top: 0.5rem;
}
</style>
