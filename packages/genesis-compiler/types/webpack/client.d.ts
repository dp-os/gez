import Genesis from '@fmfe/genesis-core';
import { BaseConfig } from './base';
export declare class ClientConfig extends BaseConfig {
    constructor(ssr: Genesis.SSR);
    toConfig(): Promise<import("webpack").Configuration>;
}
