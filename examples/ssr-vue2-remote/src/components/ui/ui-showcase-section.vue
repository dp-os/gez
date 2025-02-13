<template>
  <section class="showcase-section">
    <template v-if="$slots.header">
      <div class="section-header">
        <slot name="header"></slot>
      </div>
    </template>
    <template v-else-if="title">
      <h2 class="section-title">{{ title }}</h2>
    </template>
    <div class="section-content">
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
export interface ShowcaseSectionProps {
    title?: string;
}

defineProps<ShowcaseSectionProps>();
</script>

<style scoped>
.showcase-section {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease-in-out;
  width: 100%;
}

.showcase-section:hover {
  box-shadow: var(--shadow-md);
}

.section-header,
.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  padding: var(--spacing-4) var(--spacing-6);
  line-height: 1.5;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  min-height: 64px;
  display: flex;
  align-items: center;
}

.section-content {
  padding: var(--spacing-6);
}
</style>
