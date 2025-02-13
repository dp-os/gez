<template>
  <div class="card" :class="{ 'card--hoverable': hoverable }">
    <div v-if="$slots.header" class="card__header">
      <slot name="header"></slot>
    </div>
    <div class="card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CardProps {
    hoverable?: boolean;
}

withDefaults(defineProps<CardProps>(), {
    hoverable: false
});
</script>

<style>
.card {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.card--hoverable {
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.card__header {
  padding: var(--spacing-4) var(--spacing-6);
  border-bottom: 1px solid var(--color-border);
  font-weight: 600;
  color: var(--color-text-primary);
}

.card__body {
  padding: var(--spacing-6);
  color: var(--color-text-secondary);
}

.card__footer {
  padding: var(--spacing-4) var(--spacing-6);
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
}
</style>
