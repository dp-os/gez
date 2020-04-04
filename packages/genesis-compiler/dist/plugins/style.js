"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const extract_css_chunks_webpack_plugin_1 = __importDefault(require("extract-css-chunks-webpack-plugin"));
const postcss_preset_env_1 = __importDefault(require("postcss-preset-env"));
const cssnano_1 = __importDefault(require("cssnano"));
const genesis_core_1 = require("@fmfe/genesis-core");
class StylePlugin extends genesis_core_1.Plugin {
    webpackConfig({ target, config }) {
        const { ssr } = this;
        const { isProd, srcIncludes } = ssr;
        if (isProd) {
            if (target === 'client') {
                config.plugin('extract-css').use(extract_css_chunks_webpack_plugin_1.default, [
                    {
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
        }
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
                options: {
                    sourceMap: false,
                    plugins: () => {
                        if (!ssr.isProd)
                            return [];
                        return [
                            postcss_preset_env_1.default({
                                browsers: ssr.getBrowsers('client')
                            }),
                            cssnano_1.default({
                                preset: [
                                    'default',
                                    {
                                        mergeLonghand: false,
                                        cssDeclarationSorter: false
                                    }
                                ]
                            })
                        ];
                    }
                }
            },
            less: {
                name: 'less',
                loader: 'less-loader',
                options: {
                    sourceMap: false
                }
            },
            extract: {
                name: 'extract',
                loader: extract_css_chunks_webpack_plugin_1.default.loader,
                options: {}
            }
        };
        const getCssLoader = (isModule = false) => {
            const lds = [];
            if (!isProd) {
                lds.push(loaders['vue-style']);
            }
            else if (target === 'client') {
                lds.push(loaders.extract);
            }
            lds.push(isModule ? loaders['module-css'] : loaders.css);
            if (ssr.isProd) {
                lds.push(loaders.postcss);
            }
            return lds;
        };
        const getLessLoader = (isModule = false) => {
            return [...getCssLoader(isModule), loaders.less];
        };
        const rules = [
            {
                name: 'css',
                match: /\.css$/,
                includes: srcIncludes,
                modules: {
                    'vue-modules': {
                        resourceQuery: /module/,
                        loaders: getCssLoader(true)
                    },
                    vue: {
                        resourceQuery: /\?vue/,
                        loaders: getCssLoader()
                    },
                    'normal-modules': {
                        resourceQuery: /\.module\.\w+$/,
                        loaders: getCssLoader(true)
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
                includes: srcIncludes,
                modules: {
                    'vue-modules': {
                        resourceQuery: /module/,
                        loaders: getLessLoader(true)
                    },
                    vue: {
                        resourceQuery: /\?vue/,
                        loaders: getLessLoader()
                    },
                    'normal-modules': {
                        resourceQuery: /\.module\.\w+$/,
                        loaders: getLessLoader(true)
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
                includes: srcIncludes,
                modules: {
                    'vue-modules': {
                        resourceQuery: /module/,
                        loaders: getCssLoader(true)
                    },
                    vue: {
                        resourceQuery: /\?vue/,
                        loaders: getCssLoader()
                    },
                    'normal-modules': {
                        resourceQuery: /\.module\.\w+$/,
                        loaders: getCssLoader(true)
                    },
                    normal: {
                        resourceQuery: '',
                        loaders: getCssLoader()
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
exports.StylePlugin = StylePlugin;
