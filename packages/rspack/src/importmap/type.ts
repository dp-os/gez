/**
 * importmap 配置
 */
export interface ImportMapConfig {
    /**
     * 项目引入的模块
     * @example ['ssr-rspack-vue2/src/utils/index.ts']
     */
    imports: string[];
    /**
     * 项目暴露的模块
     * @example ['ssr-rspack-vue2/src/utils/index.ts', 'ssr-rspack-vue2/src/components/index.ts']
     */
    exposes: string[];
}
