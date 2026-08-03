<template>
  <section class="dashboard-box">
    <slot />
  </section>
</template>

<style scoped>
.dashboard-box {
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-background-soft);
}
</style>
