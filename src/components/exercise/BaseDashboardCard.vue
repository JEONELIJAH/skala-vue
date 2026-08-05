<template>
  <el-card class="dashboard-box" shadow="never">
    <slot />
  </el-card>
</template>

<style scoped>
.dashboard-box {
  border-color: var(--glass-border);
  border-radius: 1.05rem;
  background: var(--glass-surface);
  box-shadow:
    var(--shadow-card),
    inset 0 1px 0 rgb(255 255 255 / 7%);
  backdrop-filter: var(--glass-filter);
  -webkit-backdrop-filter: var(--glass-filter);
}

.dashboard-box :deep(.el-card__body) {
  padding: clamp(1rem, 3vw, 1.5rem);
}
</style>
