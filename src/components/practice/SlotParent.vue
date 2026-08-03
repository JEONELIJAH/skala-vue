<script setup>
import SlotDefaultChild from './SlotDefaultChild.vue'
import SlotNamedChild from './SlotNamedChild.vue'
import SlotScopedChild from './SlotScopedChild.vue'
// import { ref } from 'vue'
</script>

<template>
  <div class="practice-section">
    <h1>Slot Practice</h1>
    <SlotDefaultChild>
      <p>This is the content passed to the slot.</p>
    </SlotDefaultChild>
    <SlotDefaultChild> </SlotDefaultChild>
    <SlotNamedChild>
      <template #header>
        <h2>서울 날씨</h2>
      </template>
      <p>현재 27도, 맑음</p>
      <template #footer>
        <button type="button">상세보기</button>
      </template>
    </SlotNamedChild>
    <h2>Scoped Slot Parent</h2>
    <SlotScopedChild v-slot="slotBag">
      <div class="base-card">
        <p>Message from child: {{ slotBag.message }}</p>
        <p>User Count from child: {{ slotBag.userCount }}</p>
      </div>
    </SlotScopedChild>
    <SlotScopedChild> </SlotScopedChild>
  </div>
</template>
