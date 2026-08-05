<template>
  <main class="about">
    <header class="header">
      <h2>ℹ️ 서비스 소개</h2>
    </header>
    <section class="about-card">
      <p>본 앱은 Vue 3 및 Vue Router 4 기반으로 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>

      <ul>
        <li><code>components/exercise/</code> 폴더 내부의 독립 부품 연동</li>
        <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
        <li>URL 쿼리 스트링 매핑을 활용한 실시간 검색 상태 동기화</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.about {
  width: 100%;
  max-width: 60rem;
  margin: 2rem auto 0;
}
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
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

.about-card {
  margin-top: 1rem;
  padding: 1.25rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  background: var(--color-background-soft);
}

.about-card p {
  margin: 0 0 1rem;
}

.about-card ul {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding-left: 1.25rem;
}
</style>
