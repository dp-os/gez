import { mf, ssr } from './genesis';

if (!ssr.isProd) {
    /**
     * 可以在 postinstall 钩子中，尝试安装远程模块，避免Typescript或者eslint报模块找不到
     */
    mf.remote.fetch();
}
