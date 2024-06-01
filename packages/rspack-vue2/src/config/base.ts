import { type Gez } from '@gez/core';
import { type RspackOptions } from '@rspack/core';
import { VueLoaderPlugin } from 'vue-loader';

export function createBaseConfig(gez: Gez) {
    return {
        name: gez.name,
        plugins: [new (VueLoaderPlugin as any)()],
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    test: /\.ts$/,
                    loader: 'builtin:swc-loader',
                    options: {
                        sourceMap: true,
                        jsc: {
                            parser: {
                                syntax: 'typescript'
                            }
                        }
                    },
                    type: 'javascript/auto'
                },
                {
                    test: /\.less$/,
                    use: ['vue-style-loader', 'css-loader', 'less-loader'],
                    type: 'javascript/auto'
                },
                {
                    test: /\.css$/,
                    use: ['vue-style-loader', 'css-loader'],
                    type: 'javascript/auto'
                },
                {
                    test: /\.svg$/,
                    type: 'asset/resource'
                }
            ]
        },
        resolve: {
            extensions: ['.vue', '.ts', '...']
        },
        output: {
            publicPath: gez.base,
            uniqueName: gez.varName
        },
        experiments: {
            css: false
        },
        optimization: {
            minimize: false
        },
        entry: {},
        cache: false
    } satisfies RspackOptions;
}
