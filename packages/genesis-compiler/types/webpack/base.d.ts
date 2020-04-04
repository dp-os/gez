import Config from 'webpack-chain';
import webpack from 'webpack';
import Genesis from '@fmfe/genesis-core';
import { BaseGenesis } from '../utils';
export declare class BaseConfig extends BaseGenesis {
    config: Config;
    reday: Promise<void>;
    constructor(ssr: Genesis.SSR, target: Genesis.WebpackBuildTarget);
    toConfig(): webpack.Configuration;
}
