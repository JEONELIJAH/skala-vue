<script setup>
import { computed, ref } from 'vue'

const unitPrice = 8192
const productQuantity = ref(1)
const productRate = ref(3)

const totalPrice = computed(() => {
  return unitPrice * productQuantity.value
})
</script>

<template>
  <el-card>
    <template #header>
      <span>🛒 실습 2. 커머스 상품 수량 및 평점 시스템</span>
    </template>

    <el-space direction="vertical" alignment="start">
      <label>구매 수량 선택</label>
      <el-space alignment="center">
        <el-input-number v-model="productQuantity" :min="1" :max="10" />
        <span>(최대 10개 구매 가능)</span>
      </el-space>

      <label>기대 별점</label>
      <el-rate v-model="productRate" />

      <el-statistic title="결제 예정 금액" :value="totalPrice" />
    </el-space>
  </el-card>
</template>
