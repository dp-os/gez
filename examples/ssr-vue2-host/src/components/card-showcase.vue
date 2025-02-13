<template>
  <div class="card-showcase">
    <ui-card>
      <template #header>
        <h2>卡片展示</h2>
      </template>

      <div class="card-examples">
        <ui-card class="example-card">
          <template #header>
            基础卡片
          </template>
          <p>这是一个带有头部和内容的基础卡片。</p>
        </ui-card>

        <ui-card class="example-card" hoverable>
          <template #header>
            悬浮卡片
          </template>
          <p>这个卡片有悬浮效果，试试把鼠标放上去！</p>
        </ui-card>

        <ui-card class="example-card">
          <template #header>
            带底部的卡片
          </template>
          <p>这个卡片包含了底部操作区域。</p>
          <template #footer>
            <div class="card-actions">
              <ui-button size="small">取消</ui-button>
              <ui-button size="small" type="primary">确认</ui-button>
            </div>
          </template>
        </ui-card>
      </div>

      <template #footer>
        <p class="showcase-note">
          这些卡片组件来自远程模块
        </p>
      </template>
    </ui-card>
  </div>
</template>

<script setup lang="ts">
import { UiButton, UiCard } from 'ssr-vue2-remote/src/components';
</script>

<style>
.card-showcase {
  max-width: 800px;
  margin: 2rem auto;
}

.card-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.example-card {
  height: 100%;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.showcase-note {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-style: italic;
}
</style>
