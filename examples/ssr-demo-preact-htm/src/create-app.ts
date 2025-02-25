/**
 * @file 应用实例创建
 * @description 负责创建和配置应用实例
 */

import { html } from 'htm/preact';
import type { VNode } from 'preact';
import App from './app';

export function createApp(): { app: VNode } {
    const app = html`<${App} />`;
    return {
        app
    };
}
