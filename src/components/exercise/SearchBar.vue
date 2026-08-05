<script setup>
import BaseDashboardCard from './BaseDashboardCard.vue'
import { onBeforeUpdate, onUpdated } from 'vue'
import { Search } from '@element-plus/icons-vue'

// 부모 컴포넌트에서 props로 전달받은 query
defineProps({
  query: {
    type: String,
    required: true,
  },
})

// 부모 컴포넌트로 이벤트를 전달하기 위한 emit
const emit = defineEmits(['update-query'])

// 검색어가 변경될 때마다 부모 컴포넌트로 이벤트를 전달하는 함수 (Events Up)
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
    <div class="search-heading">
      <span class="search-heading__icon">
        <el-icon><Search /></el-icon>
      </span>
      <div>
        <h2 id="search-title">도시 검색</h2>
        <p>관측 목록에서 원하는 지역을 빠르게 찾아보세요.</p>
      </div>
    </div>

    <label for="city-search">지역 이름</label>
    <!-- clearable을 사용하여 입력 필드를 클리어할 수 있도록 하고, input으로 query를 업데이트 -->
    <el-input
      id="city-search"
      :model-value="query"
      size="large"
      :prefix-icon="Search"
      placeholder="예: 서울, 북극, 사하라 사막"
      autocomplete="off"
      clearable
      @input="updateQuery"
    />

    <!-- 검색 상태 메시지 -->
    <p class="search-status">
      <template v-if="query">
        <strong>“{{ query }}”</strong> 검색 결과를 표시하고 있습니다.
      </template>
      <template v-else>이름의 일부만 입력해도 검색할 수 있습니다.</template>
    </p>
  </BaseDashboardCard>
</template>

<style scoped>
.search-heading {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 1.25rem;
}

.search-heading__icon {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;
  background: var(--glass-accent);
  color: var(--color-primary);
  font-size: 1.15rem;
}

.search-heading h2 {
  font-size: 1.05rem;
  font-weight: 750;
}

.search-heading p {
  margin-top: 0.15rem;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

label {
  display: block;
  margin-bottom: 0.45rem;
  color: var(--color-heading);
  font-size: 0.82rem;
  font-weight: 700;
}

:deep(.el-input__wrapper) {
  background: var(--glass-control);
  box-shadow: 0 0 0 1px var(--color-border) inset;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--color-border-hover) inset;
}

:deep(.el-input__wrapper.is-focus) {
  background: var(--glass-control-hover);
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}

.search-status {
  min-height: 1.25rem;
  margin-top: 0.6rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}
</style>
