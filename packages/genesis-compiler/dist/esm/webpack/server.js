import { BaseConfig } from './base';
export class ServerConfig extends BaseConfig {
    constructor(ssr) {
        super(ssr, 'server');
        this.config.entry(ssr.entryName).add(this.ssr.entryServerFile).end();
        this.config.output
            .path(this.ssr.outputDirInServer)
            .filename('js/[name].js');
        this.config.devtool(false);
        this.config.output.libraryTarget('commonjs2');
        this.config.module.set('parser', {
            javascript: {
                url: 'relative'
            }
        });
    }
}
