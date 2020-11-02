import fs from 'fs';
import path from 'path';
import { Plugin, CompilerType } from '@fmfe/genesis-core';
import write from 'write';
import upath from 'upath';
import { deleteFolder } from '../utils/index';
import { minify } from 'html-minifier';

export class TemplatePlugin extends Plugin {
    public async beforeCompiler() {
        const { ssr } = this;
        deleteFolder(ssr.outputDir);
        if (fs.existsSync(ssr.templateFile)) {
            const text = fs.readFileSync(ssr.templateFile, 'utf-8');
            write.sync(
                ssr.outputTemplateFile,
                minify(text, {
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
                })
            );
        }
        const outputDir = path.resolve(ssr.outputDir, './src');
        const srcDir = ssr.srcDir;
        const clientFilename = upath.toUnix(
            path.relative(outputDir, path.resolve(srcDir, './entry-client'))
        );
        const serverFilename = upath.toUnix(
            path.relative(outputDir, path.resolve(srcDir, './entry-server'))
        );
        const writeDistSrcTemplate = (
            filename: string,
            options: { [x: string]: string } = {}
        ) => {
            let text = fs.readFileSync(
                path.resolve(__dirname, `../../../template/${filename}`),
                'utf8'
            );
            Object.keys(options).forEach((k) => {
                const value = options[k];
                text = text.replace(new RegExp(`\\\${{${k}}}`), value);
            });
            const outputDir = path.resolve(ssr.outputDir, './src');
            write.sync(path.resolve(outputDir, filename), text);
        };
        writeDistSrcTemplate('entry-client.ts', {
            clientFilename
        });
        writeDistSrcTemplate('webpack-public-path-client.ts', {
            clientFilename
        });
        writeDistSrcTemplate('entry-server.ts', {
            serverFilename
        });
        writeDistSrcTemplate('webpack-public-path-server.ts', {
            clientFilename
        });
        const writeSrcTemplate = (filename: string) => {
            const text = fs.readFileSync(
                path.resolve(__dirname, `../../../template/src/${filename}`),
                'utf8'
            );
            const output = path.resolve(ssr.srcDir, filename);
            if (fs.existsSync(output)) return false;
            write.sync(output, text);
            return true;
        };
        if (!writeSrcTemplate('entry-client.ts')) return;
        if (!writeSrcTemplate('entry-server.ts')) return;
        if (!writeSrcTemplate('app.vue')) return;
        writeSrcTemplate('shims-vue.d.ts');
    }

    public async afterCompiler(type: CompilerType) {
        const { ssr } = this;
        if (type === 'build') {
            const outputDir = path.resolve(ssr.outputDir, './src');
            deleteFolder(outputDir);
        }
    }
}
