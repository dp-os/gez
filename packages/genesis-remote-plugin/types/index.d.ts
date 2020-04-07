import { SSR, Format, Plugin, RenderData } from '@fmfe/genesis-core';
export declare class RemoteFormat extends Format {
    scriptSet: Set<string>;
    styleSet: Set<string>;
    style(data: RenderData): string;
    script(data: RenderData): string;
    scriptState(data: RenderData): string;
}
export declare class RemotePlugin extends Plugin {
    constructor(ssr: SSR);
    renderBefore(context: any): Promise<void>;
}
