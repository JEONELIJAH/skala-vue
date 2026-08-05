<script setup>
import { useConfigStore } from '@/stores/configStore'
import { Switch } from '@element-plus/icons-vue'

// configStore를 가져와서 단위 전환 기능을 사용할 수 있도록 합니다.
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <button
      class="unit-toggle"
      type="button"
      title="온도 단위 전환"
      @click="configStore.toggleUnit"
    >
      <strong>{{ configStore.unitSymbol }}</strong>
      <el-icon><Switch /></el-icon>
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  white-space: nowrap;
}

.unit-toggle {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  justify-content: center;
  min-width: 4.25rem;
  height: 3rem;
  padding: 0 0.8rem;
  border: 1px solid var(--glass-border);
  border-radius: 999px;
  background: var(--glass-control);
  color: var(--color-primary);
  box-shadow:
    0 0.35rem 0.8rem rgb(23 111 159 / 10%),
    inset 0 1px 0 rgb(255 255 255 / 55%);
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition:
    transform var(--transition-fast),
    background-color var(--transition-fast),
    border-color var(--transition-fast);
}

.unit-toggle:hover {
  border-color: var(--color-border-hover);
  background: var(--glass-control-hover);
  transform: translateY(-1px);
}

.unit-toggle:active {
  transform: translateY(0) scale(0.97);
}

.unit-toggle strong {
  color: currentColor;
  font-size: 1rem;
  font-weight: 750;
}

.unit-toggle .el-icon {
  font-size: 0.85rem;
}
</style>
