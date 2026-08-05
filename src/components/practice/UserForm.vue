<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const userForm = ref({
  email: '',
  agree: false,
})

const handleRegister = async () => {
  if (!userForm.value.email.includes('@')) {
    ElMessage.warning('❌ 올바른 이메일 형식이 아닙니다.')
    return
  }

  if (!userForm.value.agree) {
    ElMessage.warning('⚠️ 이용약관에 동의하셔야 합니다.')
    return
  }

  ElMessage.success('🎉 가입 신청이 정상적으로 완료되었습니다!')
}
</script>

<template>
  <el-card class="register-card">
    <template #header>📝 실습 1. 회원 가입 Form & 인풋 제어</template>

    <el-form :model="userForm" @submit.prevent="handleRegister">
      <el-form-item label="이메일">
        <el-input
          v-model.trim="userForm.email"
          autocomplete="email"
          placeholder="example@email.com"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-switch v-model="userForm.agree" active-text="동의함" inactive-text="동의하지 않음" />
      </el-form-item>

      <el-button type="primary" native-type="submit"> 가입하기 </el-button>
    </el-form>
  </el-card>
</template>
