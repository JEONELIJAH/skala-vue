<script setup>
import { ref } from 'vue'

const result2 = ref('')

const runTask2 = () => {
  const currentCart = ['Apple', 'Banana']
  const newProduct = { name: 'Orange', stock: 0, preview: null }

  const updatedCart = [...currentCart, newProduct.name]
  const imageStatus = newProduct.preview?.status ?? '이미지 준비중'
  const finalStock = newProduct.stock ?? 0

  result2.value =
    `카트: ${updatedCart.join(', ')} / 이미지: ${imageStatus} / 수량: ${finalStock}개`
}
</script>

<template>
  <section>
    <h2>과제 2: 안전한 장바구니</h2>
    <button type="button" @click="runTask2">
      상품 추가
    </button>
    <p>{{ result2 }}</p>
  </section>
</template>