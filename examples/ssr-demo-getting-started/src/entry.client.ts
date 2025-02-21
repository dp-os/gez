/**
 * @file 客户端入口文件
 * @description 负责客户端交互逻辑和动态更新
 */

// 获取时间显示元素并实现自动更新
const time = document.querySelector('time');
setInterval(() => {
    // 使用 ISO 格式更新时间显示
    time?.setHTMLUnsafe(new Date().toISOString());
}, 1000);
