<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const downloadProgress = ref(0)
const isDownloading = ref(false)

const confirmDelete = () => {
  ElMessageBox.confirm('서버에서 해당 파일을 영구히 삭제하시겠습니까?',
  '🔥 최종 경고', {
    confirmButtonText: '네, 삭제합니다',
    cancelButtonText: '취소',
    type: 'danger',
  })
    .then(() => {
    ElMessage.success('🗑️ 파일이 안전하게 파쇄되었습니다.')
    })
    .catch(() => {
    ElMessage.info('❌ 삭제 작업이 취소되었습니다.')
    })
}

const startDownload = () => {
  if (isDownloading.value) return (isDownloading.value = true)
  downloadProgress.value = 0

  const interval = setInterval(() => {
    downloadProgress.value += 20
    if (downloadProgress.value >= 100) {
        clearInterval(interval)
        isDownloading.value = false
        ElMessage.success('💾 대용량 데이터 로드가 완료되었습니다!')
    }
  }, 400)
}
</script>

<template>
  <el-card>
    <template #header>
        <strong> ⚙️ 실습 3. 시스템 피드백 & 프로그레스 인터렉션 </strong>
    </template>
    <el-space direction="vertical" fill>
      <el-space>
        <el-button type="danger" plain @click="confirmDelete"> 🗑️ 서버 파일 삭제 테스트</el-button>
        <el-button
            type="primary"
            :loading="isDownloading"
            @click="startDownload"
        >
            💾 데이터 동기화 시작
        </el-button>
      </el-space>
      <el-progress :percentage="downloadProgress" />
    </el-space>
  </el-card>
</template>