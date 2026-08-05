<script setup>
import { ref } from 'vue'

const result3 = ref('')
const isLoading = ref(false)
const shouldFail = ref(false)

const fetchUserId = () => {
  return new Promise((res) => {
    setTimeout(() => res({ uid: 777 }), 400)
  })
}

const fetchUserProfile = (uid, rejectRequest) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (rejectRequest) {
        reject(new Error('프로필 서버 오류'))
        return
      }
      resolve({ uid, nick: 'Graves' })
    }, 400)
  })
}

const runTask3 = async () => {
  isLoading.value = true
  result3.value = '데이터 동기화 중...'

  try {
    const { uid } = await fetchUserId()
    const { nick } = await fetchUserProfile(uid, shouldFail.value)
    result3.value = `동기화 성공: ${nick}님 환영합니다.`
  } catch (error) {
    console.error(error)
    result3.value = '통신 실패'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <section>
    <h2>과제 3: 비동기 연쇄 파이프라인 (Async/Await)</h2>
    <label>
      <input v-model="shouldFail" type="checkbox">
      프로필 요청 실패시키기
    </label>
    <button
      type="button"
      :disabled="isLoading"
      @click="runTask3"
    >
      {{ isLoading ? '동기화 중...' : '동기화 시작' }}
    </button>
    <p>{{ result3 }}</p>
  </section>
</template>
