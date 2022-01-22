import { Plugin, PostcssOptions } from '@fmfe/genesis-core';
import tailwindcss from 'tailwindcss';
// import webpack from 'webpack';
export class PostcssPlugin extends Plugin {
    public postcss(config: PostcssOptions) {
        config.postcssOptions.plugins.push(tailwindcss);
    }
    public chainWebpack(config) {
        // config.plugin('ssss').use(new DynamicImportPluginCDN());
    }
}

// class DynamicImportPluginCDN {
//     public static pluginName = 'DynamicImportPluginCDN';
//     public apply(compiler: webpack.Compiler) {
//         const { compilation } = compiler.hooks;
//         const pluginName = DynamicImportPluginCDN.pluginName;
//         const { Template } = webpack;
//         compilation.tap(pluginName, (compilation) => {
//             compilation.hooks.afterChunks.tap(pluginName, (chunks) => {

//             });
//             let mainTemplate = compilation.mainTemplate
//             mainTemplate.hooks.requireEnsure.tap(pluginName, (source, chunk, hash) => {
//                 let buf = [source]

//                 return Template.asString(buf);
//             });
//         });
//     }
// }