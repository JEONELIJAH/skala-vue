<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  watch,
} from 'vue'

const props = defineProps({
  parentCount: {
    type: Number,
    required: true,
  },
  childCount: {
    type: Number,
    required: true,
  }
})

const emit = defineEmits(['child-count'])

const childCount = ref(0)

const log = (hook) => {
  console.log(`[Child] ${hook}`)
}

onBeforeMount(() => log('onBeforeMount'))
onMounted(() => log('onMounted'))
onBeforeUpdate(() => log('onBeforeUpdate'))
onUpdated(() => log('onUpdated'))
onBeforeUnmount(() => log('onBeforeUnmount'))
onUnmounted(() => log('onUnmounted'))

watch(
  () => props.parentCount,
  (newValue, oldValue) => {
    console.log(`[Child] ${oldValue} -> ${newValue}`)
  },
)
</script>

<template>
  <section>
    <h2>Child</h2>

    <p>Parent count: {{ props.parentCount }}</p>
    <p>Child count: {{ childCount }}</p>

    <button @click="(childCount++, emit('child-count', childCount))">자식만 변경</button>
  </section>
</template>
