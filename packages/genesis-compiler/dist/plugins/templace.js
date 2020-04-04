"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const genesis_core_1 = require("@fmfe/genesis-core");
const write_1 = __importDefault(require("write"));
const index_1 = require("../utils/index");
const html_minifier_1 = require("html-minifier");
class TemplacePlugin extends genesis_core_1.Plugin {
    async beforeCompiler() {
        const { ssr } = this;
        index_1.deleteFolder(ssr.outputDir);
        if (fs_1.default.existsSync(ssr.templaceFile)) {
            const text = fs_1.default.readFileSync(ssr.templaceFile, 'utf-8');
            write_1.default.sync(ssr.outputTemplaceFile, html_minifier_1.minify(text, {
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
        const outputDir = path_1.default.resolve(ssr.outputDir, './src');
        const srcDir = ssr.srcDir;
        const clientFilename = path_1.default.relative(outputDir, path_1.default.resolve(srcDir, './entry-client'));
        const serverFilename = path_1.default.relative(outputDir, path_1.default.resolve(srcDir, './entry-server'));
        const writeTemplace = (filename, options = {}) => {
            let text = fs_1.default.readFileSync(path_1.default.resolve(__dirname, `../../templace/${filename}`), 'utf8');
            Object.keys(options).forEach((k) => {
                const value = options[k];
                text = text.replace(new RegExp(`\\\${{${k}}}`), value);
            });
            const outputDir = path_1.default.resolve(ssr.outputDir, './src');
            write_1.default.sync(path_1.default.resolve(outputDir, filename), text);
        };
        writeTemplace('entry-client.ts', {
            clientFilename
        });
        writeTemplace('entry-server.ts', {
            serverFilename
        });
    }
    async afterCompiler(type) {
        const { ssr } = this;
        if (type === 'build') {
            const outputDir = path_1.default.resolve(ssr.outputDir, './src');
            index_1.deleteFolder(outputDir);
        }
    }
}
exports.TemplacePlugin = TemplacePlugin;
