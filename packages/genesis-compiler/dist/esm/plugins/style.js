import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import postcssPresetEnv from 'postcss-preset-env';
import cssnano from 'cssnano';
import { Plugin } from '@fmfe/genesis-core';
export class StylePlugin extends Plugin {
    async chainWebpack({ target, config }) {
        const { ssr } = this;
        const { isProd } = ssr;
        const srcIncludes = [...ssr.srcIncludes, /\.css/];
        const postcssConfig = {
            target,
            postcssOptions: {
                plugins: []
            },
            sourceMap: false
        };
        Object.defineProperty(postcssConfig, 'target', {
            writable: false,
            enumerable: false
        });
        if (isProd) {
            if (target === 'client') {
                config.plugin('extract-css').use(ExtractCssChunks, [
                    {
                        ignoreOrder: true,
                        filename: 'css/[name].[contenthash:8].css',
                        chunkFilename: 'css/[name].[contenthash:8].css'
                    }
                ]);
            }
            else {
                config.module
                    .rule('vue')
                    .use('vue')
                    .tap((options = {}) => {
                    options.extractCSS = true;
                    return options;
                })
                    .end();
            }
            postcssConfig.postcssOptions.plugins.push(...[
                postcssPresetEnv({
                    browsers: ssr.getBrowsers('client')
                }),
                cssnano({
                    preset: [
                        'default',
                        {
                            mergeLonghand: false,
                            cssDeclarationSorter: false
                        }
                    ]
                })
            ]);
        }
        await this.ssr.plugin.callHook('postcss', postcssConfig);
        const loaders = {
            'vue-style': {
                name: 'vue-style',
                loader: 'vue-style-loader',
                options: {
                    sourceMap: false,
                    showMode: false
                }
            },
            css: {
                name: 'css',
                loader: 'css-loader',
                options: {
                    sourceMap: false,
                    importLoaders: 2
                }
            },
            'module-css': {
                name: 'css',
                loader: 'css-loader',
                options: {
                    sourceMap: false,
                    importLoaders: 2,
                    modules: true,
                    localIdentName: '[name]_[local]_[hash:base64:5]'
                }
            },
            postcss: {
                name: 'postcss',
                loader: 'postcss-loader',
                options: postcssConfig
            },
            less: {
                name: 'less',
                loader: 'less-loader',
                options: {
                    sourceMap: false
                }
            },
            sass: {
                name: 'sass',
                loader: 'sass-loader',
                options: {
                    sourceMap: false
                }
            },
            extract: {
                name: 'extract',
                loader: ExtractCssChunks.loader,
                options: {}
            }
        };
        const getCssLoader = ({ isModule = false } = {}) => {
            const lds = [];
            if (!isProd) {
                lds.push(loaders['vue-style']);
            }
            else if (target === 'client') {
                lds.push(loaders.extract);
            }
            lds.push(isModule ? loaders['module-css'] : loaders.css);
            if (postcssConfig.postcssOptions.plugins.length > 0) {
                lds.push(loaders.postcss);
            }
            return lds;
        };
        const getLessLoader = ({ isModule = false } = {}) => {
            return [...getCssLoader({ isModule }), loaders.less];
        };
        const getSassLoader = ({ isModule = false } = {}) => {
            return [...getCssLoader({ isModule }), loaders.sass];
        };
        const rules = [
            {
                name: 'css',
                match: /\.css$/,
                includes: srcIncludes,
                modules: {
                    'vue-modules': {
                        resourceQuery: /module/,
                        loaders: getCssLoader({ isModule: true })
                    },
                    vue: {
                        resourceQuery: /\?vue/,
                        loaders: getCssLoader()
                    },
                    'normal-modules': {
                        resourceQuery: /\.module\.\w+$/,
                        loaders: getCssLoader({ isModule: true })
                    },
                    normal: {
                        resourceQuery: '',
                        loaders: getCssLoader()
                    }
                }
            },
            {
                name: 'less',
                match: /\.less$/,
                includes: [...srcIncludes, /\.less/],
                modules: {
                    'vue-modules': {
                        resourceQuery: /module/,
                        loaders: getLessLoader({ isModule: true })
                    },
                    vue: {
                        resourceQuery: /\?vue/,
                        loaders: getLessLoader()
                    },
                    'normal-modules': {
                        resourceQuery: /\.module\.\w+$/,
                        loaders: getLessLoader({ isModule: true })
                    },
                    normal: {
                        resourceQuery: '',
                        loaders: getLessLoader()
                    }
                }
            },
            {
                name: 'postcss',
                match: /\.p(ost)?css$/,
                includes: [...srcIncludes, /\.p(ost)?css$/],
                modules: {
                    'vue-modules': {
                        resourceQuery: /module/,
                        loaders: getCssLoader({ isModule: true })
                    },
                    vue: {
                        resourceQuery: /\?vue/,
                        loaders: getCssLoader()
                    },
                    'normal-modules': {
                        resourceQuery: /\.module\.\w+$/,
                        loaders: getCssLoader({ isModule: true })
                    },
                    normal: {
                        resourceQuery: '',
                        loaders: getCssLoader()
                    }
                }
            },
            {
                name: 'sass',
                match: /\.(sass|scss)$/,
                includes: [...srcIncludes, /\.(sass|scss)$/],
                modules: {
                    'vue-modules': {
                        resourceQuery: /module/,
                        loaders: getSassLoader({ isModule: true })
                    },
                    vue: {
                        resourceQuery: /\?vue/,
                        loaders: getSassLoader()
                    },
                    'normal-modules': {
                        resourceQuery: /\.module\.\w+$/,
                        loaders: getSassLoader({ isModule: true })
                    },
                    normal: {
                        resourceQuery: '',
                        loaders: getSassLoader()
                    }
                }
            }
        ];
        for (const rule of rules) {
            const currentRule = config.module
                .rule(rule.name)
                .test(rule.match)
                .include.add(rule.includes)
                .end();
            Object.keys(rule.modules).forEach((moduleName) => {
                const r = currentRule.oneOf(moduleName);
                const currentModule = rule.modules[moduleName];
                if (currentModule.resourceQuery) {
                    r.resourceQuery(currentModule.resourceQuery);
                }
                const lds = currentModule.loaders;
                for (const currentLoader of lds) {
                    r.use(currentLoader.name)
                        .loader(currentLoader.loader)
                        .options(currentLoader.options)
                        .end();
                }
            });
        }
    }
}
