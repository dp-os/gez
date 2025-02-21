/**
 * @file 客户端入口文件
 * @description 负责客户端交互逻辑和动态更新
 */

import { createApp } from './create-app';

// 创建应用实例并初始化
const { app } = createApp();
app.onClient();
