import type { Gez } from './gez';

export interface PackConfig {
    /**
     * 是否启用归档，默认启用。
     */
    enable?: boolean;
    /**
     * 输出的文件，支持同时输出多个。
     * 默认输出为：dist.tgz
     */
    outputs?: string | string[] | boolean;
    /**
     * 创建 packages.json 执行的回调，你可以在这里修改一些数据。
     */
    packageJson?: (
        gez: Gez,
        pkgJson: Record<string, any>
    ) => Promise<Record<string, any>>;
    /**
     * 归档之前执行钩子，你可以在这里添加一些文件。
     */
    onBefore?: (gez: Gez, pkgJson: Record<string, any>) => Promise<void>;
    /**
     * 归档之后执行钩子，你可以在这里直接上传到服务器。
     */
    onAfter?: (
        gez: Gez,
        pkgJson: Record<string, any>,
        file: Buffer
    ) => Promise<void>;
}
export interface ParsedPackConfig {
    enable: boolean;
    outputs: string[];
    packageJson: (
        gez: Gez,
        pkgJson: Record<string, any>
    ) => Promise<Record<string, any>>;
    onBefore: (gez: Gez, pkgJson: Record<string, any>) => Promise<void>;
    onAfter: (
        gez: Gez,
        pkgJson: Record<string, any>,
        file: Buffer
    ) => Promise<void>;
}

export function parsePackConfig(config: PackConfig = {}): ParsedPackConfig {
    const outputs: string[] = [];
    if (typeof config.outputs === 'string') {
        outputs.push(config.outputs);
    } else if (Array.isArray(config.outputs)) {
        outputs.push(...config.outputs);
    } else if (config.outputs !== false) {
        outputs.push('dist.tgz');
    }
    return {
        enable: config.enable ?? true,
        outputs,
        async packageJson(gez, pkgJson) {
            if (config.packageJson) {
                pkgJson = await config.packageJson(gez, pkgJson);
            }
            return pkgJson;
        },
        async onBefore(gez, pkgJson: Record<string, any>) {
            await config.onBefore?.(gez, pkgJson);
        },
        async onAfter(gez, pkgJson, file) {
            await config.onAfter?.(gez, pkgJson, file);
        }
    };
}
