import { ImportMapConfig } from '@gez/rspack'

export const importmapConfig: ImportMapConfig = {
    imports: [
        'ssr-rspack-vue2/src/utils/index.ts'
    ],
    exposes: [
        './src/utils/index.ts',
    ]
};
