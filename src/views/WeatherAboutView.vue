<template>
  <main class="about">
    <header class="header">
      <h2>ℹ️ 서비스 소개</h2>
    </header>
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
