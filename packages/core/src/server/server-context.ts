import type { Gez } from '../core';

export class ServerContext {
    public html = '';
    public redirect: string | null = null;
    public status: number | null = null;
    public gez: Gez;
    public constructor(gez: Gez) {
        this.gez = gez;
    }

    public getImportmapList() {
        this.gez.moduleConfig.imports.map((item) => {
            return item.localPath;
        });
        return [];
    }
}

/**
 * 服务渲染的处理函数
 */
export type ServerRenderHandle = (
    ctx: ServerContext,
    params: any
) => Promise<void>;
