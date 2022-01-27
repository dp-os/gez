import Genesis from '@fmfe/genesis-core';

import { BaseConfig } from './base';

export class ClientConfig extends BaseConfig {
    public constructor(ssr: Genesis.SSR) {
        super(ssr, 'client');
        const { config } = this;
        config
            .entry('app')
            .add(this.ssr.entryClientFile)
            .end()
            .output.set('uniqueName', this.ssr.name);
        config.output
            .path(this.ssr.outputDirInClient)
            .filename(
                this.ssr.isProd
                    ? 'js/[name].[contenthash:8].js'
                    : 'js/[name].js'
            );
        config.devtool(false);
    }
}
