"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatePlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const fs_1 = __importDefault(require("fs"));
const html_minifier_1 = require("html-minifier");
const path_1 = __importDefault(require("path"));
const upath_1 = __importDefault(require("upath"));
const write_1 = __importDefault(require("write"));
const index_1 = require("../utils/index");
class TemplatePlugin extends genesis_core_1.Plugin {
    async beforeCompiler() {
        const { ssr } = this;
        (0, index_1.deleteFolder)(ssr.outputDir);
        if (fs_1.default.existsSync(ssr.templateFile)) {
            const text = fs_1.default.readFileSync(ssr.templateFile, 'utf-8');
            write_1.default.sync(ssr.outputTemplateFile, (0, html_minifier_1.minify)(text, {
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                decodeEntities: true,
                minifyCSS: true,
                minifyJS: true,
                processConditionalComments: true,
                removeAttributeQuotes: false,
                removeComments: false,
                removeEmptyAttributes: true,
                removeOptionalTags: false,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: false,
                removeStyleLinkTypeAttributes: false,
                removeTagWhitespace: false,
                sortClassName: false,
                trimCustomFragments: true,
                useShortDoctype: true
            }));
        }
        const outputDir = ssr.outputDirInTemplate;
        const srcDir = ssr.srcDir;
        const clientFilename = upath_1.default.toUnix(path_1.default.relative(outputDir, path_1.default.resolve(srcDir, './entry-client')));
        const serverFilename = upath_1.default.toUnix(path_1.default.relative(outputDir, path_1.default.resolve(srcDir, './entry-server')));
        const writeDistSrcTemplate = (filename, options = {}) => {
            let text = fs_1.default.readFileSync(path_1.default.resolve(__dirname, `../../../template/${filename}`), 'utf8');
            Object.keys(options).forEach((k) => {
                const value = options[k];
                text = text.replace(new RegExp(`\\\${{${k}}}`), value);
            });
            write_1.default.sync(path_1.default.resolve(outputDir, filename), text);
        };
        writeDistSrcTemplate('entry-client.ts', {
            clientFilename
        });
        writeDistSrcTemplate('webpack-public-path.ts');
        writeDistSrcTemplate('entry-server.ts', {
            serverFilename
        });
        const writeSrcTemplate = (filename) => {
            const text = fs_1.default.readFileSync(path_1.default.resolve(__dirname, `../../../template/src/${filename}`), 'utf8');
            const output = path_1.default.resolve(ssr.srcDir, filename);
            if (fs_1.default.existsSync(output))
                return false;
            write_1.default.sync(output, text);
            return true;
        };
        if (!writeSrcTemplate('entry-client.ts'))
            return;
        if (!writeSrcTemplate('entry-server.ts'))
            return;
        if (!writeSrcTemplate('app.vue'))
            return;
        writeSrcTemplate('shims-vue.d.ts');
    }
    async afterCompiler(type) {
        const { ssr } = this;
        if (type === 'build') {
            const outputDir = path_1.default.resolve(ssr.outputDirInTemplate);
            (0, index_1.deleteFolder)(outputDir);
        }
    }
}
exports.TemplatePlugin = TemplatePlugin;
