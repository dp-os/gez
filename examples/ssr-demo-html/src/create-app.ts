/**
 * @file 应用实例创建
 * @description 负责创建和配置应用实例
 */

import App from './app';

export function createApp() {
    const app = new App();
    return {
        app
    };
}
