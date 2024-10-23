import { type RspackOptions, rspack } from '@rspack/core';

import { BuildConfig } from './base';

type Config = NonNullable<RspackOptions['optimization']>;

export class Optimization extends BuildConfig<Config> {
    protected getClient(): Config {
        return {
            minimize: this.gez.isProd,
            minimizer: [
                new rspack.SwcJsMinimizerRspackPlugin({
                    minimizerOptions: {
                        format: {
                            comments: false
                        }
                    }
                }),
                new rspack.LightningCssMinimizerRspackPlugin({
                    minimizerOptions: {
                        errorRecovery: false
                    }
                })
            ]
        };
    }

    protected getServer(): Config {
        return {
            minimize: this.gez.isProd,
            minimizer: [
                new rspack.SwcJsMinimizerRspackPlugin({
                    minimizerOptions: {
                        format: {
                            comments: false
                        }
                    }
                }),
                new rspack.LightningCssMinimizerRspackPlugin({
                    minimizerOptions: {
                        errorRecovery: false
                    }
                })
            ]
        };
    }

    protected getNode(): Config {
        return {
            minimize: false
        };
    }
}
