import Genesis from '@fmfe/genesis-core';

import { getFilename } from '../utils';
import { BaseConfig } from './base';

export class ClientConfig extends BaseConfig {
    public constructor(ssr: Genesis.SSR) {
        super(ssr, 'client');
        this.config
            .entry('app')
            .add(this.ssr.entryClientFile)
            .end()
            .output.set('uniqueName', this.ssr.name);
        this.config.output
            .path(this.ssr.outputDirInClient)
            .filename(
                this.ssr.isProd
                    ? 'js/[name].[contenthash:8].js'
                    : 'js/[name].js'
            );
        this.config.devtool('eval');
        this.config.optimization.splitChunks({
            chunks: 'all'
        });
        this.config.optimization.runtimeChunk(true);
    }
}
