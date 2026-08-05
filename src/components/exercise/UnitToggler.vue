<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <el-switch
      :model-value="configStore.unit === 'fahrenheit'"
      size="large"
      inline-prompt
      active-text="℉"
      inactive-text="℃"
      aria-label="섭씨와 화씨 단위 변경"
      @change="configStore.toggleUnit"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  margin-left: auto;
  white-space: nowrap;
  font-weight: 600;
}
</style>