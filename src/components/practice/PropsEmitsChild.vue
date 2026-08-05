<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-city'])
</script>

<template>
  <button
    class="city-option"
    :class="{ 'city-option--selected': selected }"
    type="button"
    @click="emit('select-city', city)"
  >
    <span>
      <strong>{{ city.name }}</strong>
      <small>props로 받은 기온</small>
    </span>
    <b>{{ city.temp }}℃</b>
  </button>
</template>

<style scoped>
.city-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  background: var(--glass-control);
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
}

.city-option--selected {
  border-color: var(--color-primary);
  background: var(--glass-control-hover);
  box-shadow: inset 3px 0 0 var(--color-primary);
}

.city-option span {
  display: grid;
  gap: 0.15rem;
}

.city-option small {
  color: var(--color-text-muted);
  font-size: 0.68rem;
}

.city-option b {
  color: var(--color-heading);
  font-size: 1.15rem;
}
</style>
