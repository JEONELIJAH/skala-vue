<template>
  <article class="card">
    <header class="card__header">
      <slot name="header">
        <h2>기본 제목</h2>
      </slot>
    </header>

    <main class="card__body">
      <slot />
    </main>

    <footer class="card__footer">
      <slot name="footer" />
    </footer>
  </article>
</template>
