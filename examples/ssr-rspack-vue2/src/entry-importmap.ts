/**
 * importmap配置
 */
export const importmapConfig = {
    imports: [
        'ssr-rspack-vue2_remote/src/utils/index.ts'
    ],
    exposes: [
        './src/utils/index.ts',
    ]
};
