<script setup>
import {
  ref,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
} from 'vue'

import LifeCycleHookChild from './LifeCycleHookChild.vue'

const parentCount = ref(0)
const childCount = ref(0)

const showChild = ref(true)

const log = (hook) => {
  console.log(`[Parent] ${hook}`)
}

onBeforeMount(() => log('onBeforeMount'))
onMounted(() => log('onMounted'))
onBeforeUpdate(() => log('onBeforeUpdate'))
onUpdated(() => log('onUpdated'))
onBeforeUnmount(() => log('onBeforeUnmount'))
onUnmounted(() => log('onUnmounted'))

const handleChildEvent = (value) => {
  childCount.value = value
}
</script>

<template>
  <main>
    <h1>Parent</h1>

    <p>Parent count: {{ parentCount }}</p>
    <p>Child count: {{ childCount }}</p>

    <button @click="parentCount++">부모 상태 변경</button>

    <button @click="showChild = !showChild">자식 보이기/숨기기</button>

    <LifeCycleHookChild
      v-if="showChild"
      :parent-count="parentCount"
      @child-count="handleChildEvent"
    />
  </main>
</template>
