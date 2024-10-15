import fs from 'node:fs/promises';
import path from 'node:path';
import type { Gez, PackageJson } from './gez';

export class ServerContext {
    public html = '';
    public redirect: string | null = null;
    public status: number | null = null;
    public gez: Gez;
    public constructor(gez: Gez) {
        this.gez = gez;
    }
    public getManifests(): Promise<PackageJson[]> {
        return Promise.all(
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
    public async getImportmapFiles() {
        const list = await this.getManifests();
        return list.map((item) => {
            return `/${item.name}/importmap.${item.hash}.js`;
        });
    }
}

/**
 * 服务渲染的处理函数
 */
export type ServerRenderHandle = (
    ctx: ServerContext,
    params: any
) => Promise<void>;
