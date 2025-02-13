<template>
  <div class="theme-customizer">
    <ui-card>
      <template #header>
        <h2>主题定制</h2>
      </template>

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

      <template #footer>
        <ui-button @click="resetTheme">重置主题</ui-button>
      </template>
    </ui-card>
  </div>
</template>

<script setup lang="ts">
import { UiButton, UiCard } from 'ssr-vue2-remote/src/components';
import {
    type Theme,
    defaultTheme,
    useTheme
} from 'ssr-vue2-remote/src/composables';

const { theme, updateTheme } = useTheme();

const formatKey = (key: keyof Theme) => {
    const keyMap: Record<keyof Theme, string> = {
        colorPrimary: '主要颜色',
        colorPrimaryDark: '主要暗色',
        colorSecondary: '次要颜色',
        colorSecondaryDark: '次要暗色',
        colorSuccess: '成功颜色',
        colorSuccessDark: '成功暗色',
        colorWarning: '警告颜色',
        colorWarningDark: '警告暗色',
        colorDanger: '危险颜色',
        colorDangerDark: '危险暗色',
        colorTextPrimary: '主要文本',
        colorTextSecondary: '次要文本',
        colorBackground: '背景颜色',
        colorBorder: '边框颜色'
    };
    return keyMap[key] || key;
};

const handleColorChange = (e: Event, key: keyof Theme) => {
    const target = e.target as HTMLInputElement;
    updateTheme({ [key]: target.value });
};

const resetTheme = () => {
    updateTheme(defaultTheme);
};
</script>

<style>
.theme-customizer {
  max-width: 800px;
  margin: 2rem auto;
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
}

.color-picker label {
  flex: 1;
  color: var(--colorTextSecondary);
}

.color-picker input {
  width: 50px;
  height: 30px;
  padding: 0;
  border: 1px solid var(--colorBorder);
  border-radius: 4px;
  cursor: pointer;
}
</style>
