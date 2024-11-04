import fs from 'node:fs/promises';
import path from 'node:path';
import serialize from 'serialize-javascript';
import type { Gez, PackageJson } from './gez';

/**
 * 渲染的参数
 */
export interface RenderContextOptions {
    /**
     * 静态资产的 base 地址，默认为空
     */
    base?: string;
    /**
     * 自定义请求的参数
     */
    params?: Record<string, any>;
}

/**
 * 渲染上下文
 */
export class RenderContext {
    public html = '';
    public redirect: string | null = null;
    public status: number | null = null;
    public gez: Gez;
    private _packages: PackageJson[] | null = null;
    /**
     * 静态资源请求的基本地址
     */
    public readonly base: string;
    public readonly params: Record<string, any>;
    public constructor(gez: Gez, options: RenderContextOptions = {}) {
        this.gez = gez;
        this.base = options.base ?? '';
        this.params = options.params ?? {};
    }
    /**
     * 透传 https://github.com/yahoo/serialize-javascript
     */
    public serialize(input: any, options?: serialize.SerializeJSOptions) {
        return serialize(input, options);
    }
    /**
     * 获取全部的远程包信息
     */
    public async getPackagesJson(): Promise<PackageJson[]> {
        if (!this._packages) {
            this._packages = await Promise.all(
                this.gez.moduleConfig.imports.map(async (item) => {
                    const file = path.resolve(
                        item.localPath,
                        'client/package.json'
                    );
                    const result = await fs.readFile(file, 'utf-8');
                    const json = JSON.parse(result) as PackageJson;
                    json.name = item.name;
                    return json;
                })
            );
        }
        return this._packages;
    }
    /**
     * 获取所有的 importmap js文件地址
     */
    public async getImportmapFiles() {
        const list = await this.getPackagesJson();
        const { base } = this;
        return list.map((item) => {
            const hash = item.hash ? '.' + item.hash : '';
            return `${base}/${item.name}/importmap${hash}.js`;
        });
    }
    /**
     * 获取当前注入的 JS 代码
     */
    public async script() {
        const { gez } = this;
        const files = await this.getImportmapFiles();
        return `
${files
    .map((file) => {
        return `<script src="${file}"></script>`;
    })
    .join('\n')}
<script defer>
;((d) => {
    let i = window.__importmap__;
    if (!i) return;
    let s = d.createElement('script');
    s.type = 'importmap';
    s.innerText = JSON.stringify(i)
    d.body.appendChild(s);
})(document);
</script>
<script type="module">
    import "${gez.name}/entry";
</script>
`;
    }
}

/**
 * 服务渲染的处理函数
 */
export type ServerRenderHandle = (
    render: RenderContext,
    ...args: any[]
) => Promise<void>;
