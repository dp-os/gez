import type { BuildOptions } from '@fmfe/genesis-core/src';

export interface Service extends ProxyTargetDetailed {
    protocol?: string,
    name?: string;
    host?: string,
    port: number;
    api: string;
}

export interface ServiceOptions extends Service {
    name: string;
    baseDir: string;
    entryClient?: string,
    entryServer?: string,
    isProd?: boolean;
    cdnPublicPath?: string;
    proxyService?: Service[] | Service,
    build: BuildOptions;
}

export interface GenesisConfig extends ServiceOptions {
    models: ServiceOptions[]
}
