`<template>
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
interface Props {
    hoverable?: boolean;
}

withDefaults(defineProps<Props>(), {
    hoverable: false
});
</script>

<style>
.card {
  background-color: var(--color-background, white);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  overflow: hidden;
  border: 1px solid var(--color-border, #e5e7eb);
}

.card--hoverable {
  transition: transform 0.2s, box-shadow 0.2s;
}

.card--hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.card__header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  font-weight: 600;
  color: var(--color-text-primary, #111827);
}

.card__body {
  padding: 1.5rem;
  color: var(--color-text-secondary, #4b5563);
}

.card__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border, #e5e7eb);
  background-color: var(--color-background-secondary, #f9fafb);
}
</style>`
