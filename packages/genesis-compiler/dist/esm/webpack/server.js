import { BaseConfig } from './base';
export class ServerConfig extends BaseConfig {
    constructor(ssr) {
        super(ssr, 'server');
        const { config } = this;
        config.entry(ssr.entryName).add(ssr.entryServerFile).end();
        config.output.path(ssr.outputDirInServer).filename('js/[name].js');
        config.devtool(false);
        config.output.libraryTarget('commonjs2');
        config.module.set('parser', {
            javascript: {
                url: 'relative'
            }
        });
    }
}
