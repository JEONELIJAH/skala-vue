<script setup>
defineProps({
  step: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  topics: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="challenge-panel">
    <header class="challenge-panel__header">
      <div>
        <span class="challenge-panel__step">{{ step }}</span>
        <h2>{{ title }}</h2>
        <p v-if="description">{{ description }}</p>
      </div>

      <div v-if="topics.length" class="challenge-panel__topics">
        <span v-for="topic in topics" :key="topic">{{ topic }}</span>
      </div>
    </header>

    <div class="challenge-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.challenge-panel {
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-panel);
  background: rgb(17 68 116 / 34%);
  box-shadow:
    var(--shadow-card),
    inset 0 1px 0 rgb(255 255 255 / 8%);
  overflow: hidden;
  backdrop-filter: var(--glass-filter);
}

.challenge-panel__header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  padding: clamp(1rem, 3vw, 1.5rem);
  border-bottom: 1px solid var(--color-border);
  background: rgb(255 255 255 / 7%);
}

.challenge-panel__step {
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.challenge-panel h2 {
  margin-top: 0.25rem;
  font-size: clamp(1.15rem, 3vw, 1.45rem);
  letter-spacing: -0.025em;
}

.challenge-panel__header p {
  max-width: 44rem;
  margin-top: 0.35rem;
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.challenge-panel__topics {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: flex-end;
  max-width: 24rem;
}

.challenge-panel__topics span {
  padding: 0.28rem 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--glass-control);
  color: var(--color-text);
  font-size: 0.68rem;
  font-weight: 700;
}

.challenge-panel__body {
  padding: clamp(1rem, 3vw, 1.5rem);
}

@media (max-width: 42rem) {
  .challenge-panel__header {
    flex-direction: column;
  }

  .challenge-panel__topics {
    justify-content: flex-start;
  }
}
</style>
