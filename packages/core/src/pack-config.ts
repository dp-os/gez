import type { Gez } from './gez';

export interface PackConfig {
    /**
     * 是否启用归档
     */
    enable?: boolean;
    /**
     * 输出的文件
     */
    outputs?: string | string[] | boolean;
    /**
     * 发布的类型
     * 环境变量设置：process.env.RELEASE_TYPE
     */
    releaseType?:
        | 'major'
        | 'premajor'
        | 'minor'
        | 'preminor'
        | 'patch'
        | 'prepatch'
        | 'prerelease';
    packageJson?: (
        gez: Gez,
        pkgJson: Record<string, any>
    ) => Promise<Record<string, any>>;
    onBefore?: (gez: Gez, pkgJson: Record<string, any>) => Promise<void>;
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
        enable: config.enable ?? false,
        outputs,
        async packageJson(gez, pkgJson) {
            const { dependencies } = pkgJson;
            if (config.packageJson) {
                pkgJson = await config.packageJson(gez, pkgJson);
            }
            if (dependencies) {
                Object.keys(dependencies).forEach((name) => {
                    const value = dependencies[name];
                    if (value && /^(workspace|file):/.test(value)) {
                        dependencies[name] = undefined;
                    }
                });
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
