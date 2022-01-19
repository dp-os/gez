import { Plugin } from '@fmfe/genesis-core';
import { getFilename } from '../utils';
export class WorkerPlugin extends Plugin {
    chainWebpack({ config }) {
        const { ssr } = this;
        config.module
            .rule('worker')
            .test(/\.worker\.(c|m)?(t|j)s$/i)
            .include.add(ssr.srcIncludes)
            .end()
            .use('worker')
            .loader('worker-loader')
            .options({
            esModule: false,
            filename: getFilename(ssr, 'worker')
        });
    }
}
