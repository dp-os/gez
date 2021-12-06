import Genesis from '@fmfe/genesis-core';
import nodeExternals from 'webpack-node-externals';

import { BaseConfig } from './base';

export class ServerConfig extends BaseConfig {
    public constructor(ssr: Genesis.SSR) {
        super(ssr, 'server');
        this.config.entry('app').add(this.ssr.entryServerFile).end();
        this.config.output
            .path(this.ssr.outputDirInServer)
            .filename(
                this.ssr.isProd
                    ? 'js/[name].[contenthash:8].js'
                    : 'js/[name].js'
            );
        this.config.target('node');
        this.config.devtool('source-map');
        this.config.output.libraryTarget('commonjs2');
        this.config.externals(
            nodeExternals({
                allowlist: [
                    /\.css$/,
                    /\.less$/,
                    /\?vue&type=style/,
                    /core-js/,
                    /@babel\/runtime/,
                    /regenerator-runtime/,
                    ...this.ssr.transpile
                ]
            })
        );
        this.config.optimization.minimize(false);
    }
}
