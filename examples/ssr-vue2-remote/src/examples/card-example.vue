<template>
  <ui-card class="component-section">
    <template #header>
      <h2>Card 卡片</h2>
    </template>
    <div class="component-doc">
      <div class="demo-block">
        <h3>基础用法</h3>
        <div class="demo-content">
          <ui-card class="demo-card">
            <template #header>
              <h3>卡片标题</h3>
            </template>
            <p>这是一个基础的卡片组件示例。</p>
            <p>你可以在这里放置任何内容。</p>
            <template #footer>
              <div class="card-footer">
                <ui-button type="primary">确认</ui-button>
                <ui-button type="secondary">取消</ui-button>
              </div>
            </template>
          </ui-card>
        </div>
      </div>

      <div class="demo-block">
        <h3>简单卡片</h3>
        <div class="demo-content">
          <ui-card class="demo-card">
            <p>这是一个没有标题和页脚的简单卡片。</p>
            <p>适用于简单的内容展示。</p>
          </ui-card>
        </div>
      </div>

      <div class="demo-block">
        <h3>可悬浮</h3>
        <div class="demo-content">
          <ui-card class="demo-card" hoverable>
            <template #header>
              <h3>悬浮效果</h3>
            </template>
            <p>将鼠标悬浮在卡片上会有阴影效果。</p>
            <p>适用于可点击的卡片内容。</p>
          </ui-card>
        </div>
      </div>
    </div>
  </ui-card>
</template>

<script setup lang="ts">
import { UiButton, UiCard } from '../components';
</script>

<style scoped>
.component-doc {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.demo-block h3 {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  color: var(--color-text-primary);
}

.demo-content {
  padding: 1.5rem;
  border-radius: 0.5rem;
  background-color: white;
  border: 1px solid var(--color-border);
}

.demo-card {
  max-width: 300px;
}

.demo-card p {
  margin: 0.5rem 0;
  color: var(--color-text-secondary);
}

.demo-card h3 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.card-footer {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
