<script setup>
import { ref } from 'vue'

const message = ref('현재 서버 상태 정상')
const userCount = ref(0)
</script>

<template>
  <div class="base-card">
    <h2>Scoped Slot Child</h2>
    <slot :message="message" :user-count="userCount">
      <p>This is the default content for the scoped slot.</p>
    </slot>
  </div>
</template>
