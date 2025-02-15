import type { Gez } from './gez';

export interface PackConfig {
    /**
     * 是否启用打包归档功能。
     * 启用后会将构建产物打包成标准的 .tgz 格式软件包。
     * @default false
     */
    enable?: boolean;

    /**
     * 指定输出的软件包文件路径。
     * 支持以下配置方式：
     * - string: 单个输出路径，如 'dist/versions/my-app.tgz'
     * - string[]: 多个输出路径，如 ['dist/versions/latest.tgz', 'dist/versions/1.0.0.tgz']
     * - boolean: true 时使用默认路径 'dist/client/versions/latest.tgz'
     * @default 'dist/client/versions/latest.tgz'
     */
    outputs?: string | string[] | boolean;

    /**
     * 自定义 package.json 内容的回调函数。
     * 在打包之前会调用此函数，你可以修改或扩展 package.json 的内容。
     *
     * @example
     * ```ts
     * packageJson: async (gez, pkgJson) => {
     *   // 添加额外的依赖
     *   pkgJson.dependencies['some-lib'] = '^1.0.0';
     *   // 修改版本号
     *   pkgJson.version = '1.0.0';
     *   return pkgJson;
     * }
     * ```
     */
    packageJson?: (
        gez: Gez,
        pkgJson: Record<string, any>
    ) => Promise<Record<string, any>>;

    /**
     * 打包前的钩子函数。
     * 在生成 .tgz 文件之前调用，可以用来添加额外的文件或执行其他准备工作。
     *
     * @example
     * ```ts
     * onBefore: async (gez, pkgJson) => {
     *   // 添加额外的文件
     *   await fs.writeFile('dist/README.md', '# My App');
     *   // 执行其他准备工作
     *   await runTests();
     * }
     * ```
     */
    onBefore?: (gez: Gez, pkgJson: Record<string, any>) => Promise<void>;

    /**
     * 打包后的钩子函数。
     * 在 .tgz 文件生成后调用，可以用来上传软件包到服务器或执行其他后续操作。
     *
     * @example
     * ```ts
     * onAfter: async (gez, pkgJson, file) => {
     *   // 上传到 npm 仓库
     *   await uploadToNpm(file);
     *   // 或上传到自定义服务器
     *   await uploadToServer(file, 'https://your-server.com/packages');
     * }
     * ```
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
        outputs.push('dist/client/versions/latest.tgz');
    }
    return {
        enable: config.enable ?? false,
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
