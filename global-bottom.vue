<template>
  <div class="slide-number">
    {{ $nav.currentPage }}
  </div>
</template>

<style scoped>
.slide-number {
  position: fixed;
  bottom: 0.8rem;
  right: 1.0rem;
  z-index: 9999;
  background-color: var(--ctp-surface0);
  color: var(--ctp-blue);
  border: 1px solid var(--ctp-blue);
  border-radius: 10px;
  padding: 0.2em 0.8em;
  font-size: 0.8em;
  font-weight: 800;
  letter-spacing: 0.03em;
  user-select: none;
  pointer-events: none;
}
</style>
