/**
 * 构建目标环境类型
 * @description 定义了应用程序的构建目标环境，用于配置构建过程中的特定优化和功能
 * - node: 构建为 Node.js 环境运行的代码
 * - client: 构建为浏览器环境运行的代码
 * - server: 构建为服务端环境运行的代码
 */
export type BuildTarget = 'node' | 'client' | 'server';
