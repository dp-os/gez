/**
 * @file 客户端入口文件
 * @description 负责客户端交互逻辑和动态更新
 */

import { createApp } from './create-app';

// 创建 Vue 实例
const { app } = createApp();

// 挂载 Vue 实例
app.mount('#app');
