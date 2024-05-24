import fs from 'node:fs';
import path from 'node:path';

import { type Gez } from '@gez/core';
import { build as viteBuild } from 'vite';

import { mergeViteConfig } from './vite-config';

async function buildClient(gez: Gez, src: string) {
    await viteBuild(
        mergeViteConfig(gez, {
            build: {
                modulePreload: false,
                manifest: true,
                rollupOptions: {
                    input: path.resolve(src, 'entry-client.ts')
                },
                outDir: gez.getProjectPath('dist/client')
            }
        })
    );
    const filename = path.resolve(gez.root, 'dist/client/.vite/manifest.json');
    if (fs.existsSync(filename)) {
        fs.renameSync(
            filename,
            gez.getProjectPath('dist/client/manifest.json')
        );
    }
}
async function buildServer(gez: Gez, src: string) {
    await viteBuild(
        mergeViteConfig(gez, {
            publicDir: false,
            ssr: {
                external: [],
                noExternal: [/./]
            },
            build: {
                rollupOptions: {
                    input: path.resolve(src, 'entry-server.ts')
                },
                outDir: gez.getProjectPath('dist/server'),
                ssr: true
            }
        })
    );
}
async function buildNode(gez: Gez, src: string) {
    await viteBuild(
        mergeViteConfig(gez, {
            publicDir: false,
            ssr: {
                external: ['@gez/core', '@gez/vite']
            },
            build: {
                rollupOptions: {
                    input: path.resolve(src, 'entry-node.ts')
                },
                outDir: gez.getProjectPath('dist/node'),
                ssr: true
            }
        })
    );
}

export async function build(gez: Gez) {
    const source = gez.getProjectPath('src');
    const args = process.argv;
    if (!args.includes('--no-build-client')) {
        await buildClient(gez, source);
    }
    if (!args.includes('--no-build-server')) {
        await buildServer(gez, source);
    }
    if (!args.includes('--no-build-node')) {
        await buildNode(gez, source);
    }
}
