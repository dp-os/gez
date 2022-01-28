import { BaseConfig } from './base';
export class ClientConfig extends BaseConfig {
    constructor(ssr) {
        super(ssr, 'client');
        const { config } = this;
        config
            .entry(ssr.entryName)
            .add(ssr.entryClientFile)
            .end()
            .output.set('uniqueName', ssr.name);
        config.output
            .path(ssr.outputDirInClient)
            .filename(ssr.isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].js');
        config.devtool(false);
    }
}
