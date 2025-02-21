/**
 * @file Vue 实例创建
 * @description 负责创建和配置 Vue 应用实例
 */

import { createSSRApp } from 'vue';
import App from './app.vue';

export function createApp() {
    const app = createSSRApp(App);
    return {
        app
    };
}
