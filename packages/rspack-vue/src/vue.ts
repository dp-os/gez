import type { Gez } from '@gez/core';
import type { RspackHtmlAppOptions } from '@gez/rspack';
import { createRspackVueApp } from './vue-core';

export interface RspackVueAppOptions extends RspackHtmlAppOptions {
    /**
     * vue-loader 配置项
     *
     * 用于配置 Vue 单文件组件的编译选项，完整选项参考:
     * https://github.com/vuejs/vue-loader
     */
    vueLoader?: Record<string, any>;
}

/**
 * 创建 Vue 2 应用构建器
 *
 * @param gez - Gez 实例
 * @param options - Rspack Vue 应用配置项
 * @returns 返回一个 Promise，解析为构建好的应用实例
 *
 * @example
 * ```ts
 * import type { GezOptions } from '@gez/core';
 *
 * export default {
 *   async devApp(gez) {
 *     return import('@gez/rspack-vue').then((m) =>
 *       m.createRspackVue2App(gez, {
 *         config({ config }) {
 *           // 自定义 Rspack 配置
 *         }
 *       })
 *     );
 *   }
 * } satisfies GezOptions;
 * ```
 */
export function createRspackVue2App(gez: Gez, options?: RspackVueAppOptions) {
    return createRspackVueApp(gez, '2', options);
}

/**
 * 创建 Vue 3 应用构建器
 *
 * @param gez - Gez 实例
 * @param options - Rspack Vue 应用配置项
 * @returns 返回一个 Promise，解析为构建好的应用实例
 *
 * @example
 * ```ts
 * import type { GezOptions } from '@gez/core';
 *
 * export default {
 *   async devApp(gez) {
 *     return import('@gez/rspack-vue').then((m) =>
 *       m.createRspackVue3App(gez, {
 *         config({ config }) {
 *           // 自定义 Rspack 配置
 *         }
 *       })
 *     );
 *   }
 * } satisfies GezOptions;
 * ```
 */
export function createRspackVue3App(gez: Gez, options?: RspackVueAppOptions) {
    return createRspackVueApp(gez, '3', options);
}
