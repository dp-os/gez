<template>
  <div class="app">
    <ui-card class="demo-card">
      <template #header>
        <h1>Gez UI 组件</h1>
      </template>

      <section class="demo-section">
        <h2>按钮</h2>
        <div class="button-group">
          <ui-button v-for="type in buttonTypes" :key="type" :type="type">
            {{ type }}
          </ui-button>
        </div>
        <div class="button-group">
          <ui-button v-for="size in buttonSizes" :key="size" :size="size">
            {{ size }}
          </ui-button>
        </div>
        <div class="button-group">
          <ui-button>加载中</ui-button>
          <ui-button disabled>禁用状态</ui-button>
        </div>
      </section>

      <section class="demo-section">
        <h2>主题</h2>
        <div class="theme-controls">
          <div v-for="(color, key) in theme" :key="key" class="color-picker">
            <label>{{ formatKey(key) }}</label>
            <input 
              type="color" 
              :value="color" 
              @input="handleColorChange($event, key)" 
            />
          </div>
        </div>
      </section>

      <template #footer>
        <p>当前时间: {{ time }}</p>
      </template>
    </ui-card>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { UiButton, UiCard } from './components';
import { defaultTheme, useTheme } from './composables/use-theme';

const buttonTypes = [
    'primary',
    'secondary',
    'success',
    'warning',
    'danger'
] as const;
const buttonSizes = ['small', 'medium', 'large'] as const;

const time = ref(new Date().toLocaleString());
const { theme, updateTheme } = useTheme(defaultTheme);

// 格式化主题 key
const formatKey = (key: string) => {
    const keyMap: Record<string, string> = {
        primary: '主要颜色',
        secondary: '次要颜色',
        success: '成功颜色',
        warning: '警告颜色',
        danger: '危险颜色',
        textPrimary: '主要文本',
        textSecondary: '次要文本',
        border: '边框颜色',
        background: '背景颜色'
    };
    return keyMap[key] || key;
};

const handleColorChange = (e: Event, key: string) => {
    const target = e.target as HTMLInputElement;
    updateTheme({ [key]: target.value });
};

// 更新时间
onMounted(() => {
    const timer = setInterval(() => {
        time.value = new Date().toLocaleString();
    }, 1000);

    onBeforeUnmount(() => {
        clearInterval(timer);
    });
});
</script>

<style>
.app {
  min-height: 100vh;
  padding: 2rem;
  background-color: #f3f4f6;
}

.demo-card {
  max-width: 800px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 2rem;
}

.demo-section h2 {
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.theme-controls {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.color-picker label {
  min-width: 100px;
  color: var(--color-text-secondary);
}

.color-picker input {
  width: 50px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
}
</style>