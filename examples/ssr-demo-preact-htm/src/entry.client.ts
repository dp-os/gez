/**
 * @file 客户端入口文件
 * @description 负责客户端交互逻辑和动态更新
 */

import { render } from 'preact';
import { createApp } from './create-app';

// 创建应用实例
const { app } = createApp();

// 挂载应用实例
render(app, document.getElementById('app')!);
