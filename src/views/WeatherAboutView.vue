<template>
  <main class="about">
    <header class="header">
      <h2>ℹ️ 서비스 소개</h2>
    </header>
    <body>
      <p>본 앱은 Vue 3 및 Vue Router 4 기반 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>
      <ul>
        <li>`components/exercise/` 폴더 내부의 독립 부품 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>URL 쿼리 스트링 매핑을 활용한 실시간 검색 상태 동기화</li>
      </ul>
    </body>
  </main>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-height: none;
  margin-top: 5rem;
}

.header h2 {
  width: min(100%, 60rem);
  margin: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  font-weight: 700;
}
</style>
