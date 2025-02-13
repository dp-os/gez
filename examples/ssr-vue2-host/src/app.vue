<template>
  <div class="app">
    <header class="header">
      <ui-card>
        <h1>Gez UI 组件演示</h1>
        <p>这是一个使用 Module Link 来展示远程 UI 组件的示例。</p>
      </ui-card>
    </header>

    <main class="main">
      <theme-customizer />
      <button-showcase />
      <card-showcase />
    </main>

    <footer class="footer">
      <ui-card>
        <p>
          基于 <a href="https://github.com/dp-os/gez" target="_blank" rel="noopener">Gez</a>
          构建 - 一个 Module Link 框架
        </p>
      </ui-card>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { UiCard } from 'ssr-vue2-remote/src/components';
import { ButtonShowcase, CardShowcase, ThemeCustomizer } from './components';
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  background-color: #f3f4f6;
  color: var(--color-text-primary, #111827);
  min-height: 100vh;
}

.app {
  padding: 2rem;
}

.header {
  max-width: 800px;
  margin: 0 auto 2rem;
  text-align: center;
}

.header h1 {
  margin: 0 0 1rem;
  color: var(--color-text-primary);
}

.header p {
  margin: 0;
  color: var(--color-text-secondary);
}

.main {
  margin: 2rem 0;
}

.footer {
  max-width: 800px;
  margin: 2rem auto 0;
  text-align: center;
}

.footer p {
  margin: 0;
  color: var(--color-text-secondary);
}

.footer a {
  color: var(--color-primary);
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>