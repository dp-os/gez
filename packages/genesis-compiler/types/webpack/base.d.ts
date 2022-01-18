import Genesis from '@fmfe/genesis-core';
import webpack from 'webpack';
import Config from 'webpack-chain';
import { BaseGenesis } from '../utils';
export declare class BaseConfig extends BaseGenesis {
    config: Config;
    ready: Promise<void>;
    constructor(ssr: Genesis.SSR, target: Genesis.WebpackBuildTarget);
    toConfig(): Promise<webpack.Configuration>;
}
