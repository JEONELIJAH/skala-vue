<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore';

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const configStore = useConfigStore()

const displayTemp = computed(() => {
  const rawTemp = props.city.temp

  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <article class="weather-card" :class="{ 'weather-card--selected': selected }">
    <button
      class="weather-card__summary"
      type="button"
      :aria-pressed="selected"
      @click="emit('select-card')"
    >
      <strong>{{ city.name }} ({{ city.status }})</strong>
      <span>현재 기온: {{ displayTemp }} {{ configStore.unitSymbol }}</span>

      <span v-if="city.temp >= 25" class="temperature-label temperature-label--hot">
        🔥 더움 (25도 이상)
      </span>
      <span v-else-if="city.temp < 25 && city.temp >= 22" class="temperature-label temperature-label--mild"> 🍃 선선함 (22-24도) </span>
      <span v-else class="temperature-label temperature-label--cold"> ❄️ 쌀쌀함 (22도 미만) </span>
    </button>

    <button
      class="weather-card__detail"
      type="button"
      :aria-label="`${city.name} 날씨 상세보기`"
      @click.stop="emit('click-detail')"
    >
      상세보기
    </button>
  </article>
</template>

<style scoped>
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

.weather-card button:focus-visible {
  outline: 3px solid rgb(66 184 131 / 35%);
  outline-offset: 2px;
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

.temperature-label--mild {
  background: #129600;
}

.temperature-label--cold {
  background: #3182ce;
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
