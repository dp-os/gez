<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="header-info">
          <h1>{{ title }}</h1>
          <p class="header-description">{{ description }}</p>
          <div class="version-tags">
            <span v-for="tag in tags" :key="tag" class="version-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
export interface ModuleHeaderProps {
    title: string;
    description: string;
    tags?: string[];
}

withDefaults(defineProps<ModuleHeaderProps>(), {
    tags: () => ['Vue 2.7', 'SSR', 'ESM']
});
</script>

<style scoped>
.app-header {
  background-color: var(--color-bg-primary);
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-8) 0;
}

.container {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--spacing-8);
}

@media (max-width: 960px) {
  .container {
    max-width: 100%;
    padding: 0 var(--spacing-4);
  }
}

.header-content {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
}

.header-info {
  max-width: 640px;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 var(--spacing-4);
  color: var(--color-text-primary);
}

.header-description {
  font-size: 1.125rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-4);
}

.version-tags {
  display: flex;
  gap: var(--spacing-2);
}

.version-tag {
  display: inline-block;
  padding: var(--spacing-1) var(--spacing-3);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
