import fs from 'fs';
import path from 'path';
import { Plugin, CompilerType } from '@fmfe/genesis-core';
import write from 'write';
import { deleteFolder } from '../utils/index';
import { minify } from 'html-minifier';

export class TemplacePlugin extends Plugin {
    public async beforeCompiler() {
        const { ssr } = this;
        deleteFolder(ssr.outputDir);
        if (fs.existsSync(ssr.templaceFile)) {
            const text = fs.readFileSync(ssr.templaceFile, 'utf-8');
            write.sync(
                ssr.outputTemplaceFile,
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
        const clientFilename = path.relative(
            outputDir,
            path.resolve(srcDir, './entry-client')
        );
        const serverFilename = path.relative(
            outputDir,
            path.resolve(srcDir, './entry-server')
        );
        const writeTemplace = (
            filename: string,
            options: { [x: string]: string } = {}
        ) => {
            let text = fs.readFileSync(
                path.resolve(__dirname, `../../templace/${filename}`),
                'utf8'
            );
            Object.keys(options).forEach((k) => {
                const value = options[k];
                text = text.replace(new RegExp(`\\\${{${k}}}`), value);
            });
            const outputDir = path.resolve(ssr.outputDir, './src');
            write.sync(path.resolve(outputDir, filename), text);
        };
        writeTemplace('entry-client.ts', {
            clientFilename
        });
        writeTemplace('entry-server.ts', {
            serverFilename
        });
    }

    public async afterCompiler(type: CompilerType) {
        const { ssr } = this;
        if (type === 'build') {
            const outputDir = path.resolve(ssr.outputDir, './src');
            deleteFolder(outputDir);
        }
    }
}
