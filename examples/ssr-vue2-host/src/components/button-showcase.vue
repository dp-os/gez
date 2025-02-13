<template>
  <div class="button-showcase">
    <ui-card>
      <template #header>
        <h2>按钮展示</h2>
      </template>

      <section class="showcase-section">
        <h3>按钮类型</h3>
        <div class="button-group">
          <ui-button v-for="type in buttonTypes" :key="type" :type="type">
            {{ buttonTypeMap[type] }}
          </ui-button>
        </div>
      </section>

      <section class="showcase-section">
        <h3>按钮尺寸</h3>
        <div class="button-group">
          <ui-button v-for="size in buttonSizes" :key="size" :size="size" type="primary">
            {{ buttonSizeMap[size] }}
          </ui-button>
        </div>
      </section>

      <section class="showcase-section">
        <h3>按钮状态</h3>
        <div class="button-group">
          <ui-button loading type="primary">加载中</ui-button>
          <ui-button disabled type="primary">已禁用</ui-button>
        </div>
      </section>

      <template #footer>
        <p class="showcase-note">
          这些按钮组件来自远程模块
        </p>
      </template>
    </ui-card>
  </div>
</template>

<script setup lang="ts">
import { UiButton, UiCard } from 'ssr-vue2-remote/src/components';

const buttonTypes = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger'
] as const;
const buttonSizes = ['small', 'medium', 'large'] as const;

const buttonTypeMap: Record<(typeof buttonTypes)[number], string> = {
    primary: '主要按钮',
    secondary: '次要按钮',
    success: '成功按钮',
    warning: '警告按钮',
    danger: '危险按钮'
};

const buttonSizeMap: Record<(typeof buttonSizes)[number], string> = {
    small: '小型',
    medium: '中型',
    large: '大型'
};
</script>

<style>
.button-showcase {
  max-width: 800px;
  margin: 2rem auto;
}

.showcase-section {
  margin-bottom: 2rem;
}

.showcase-section h3 {
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  font-size: 1.125rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.showcase-note {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-style: italic;
}
</style>
