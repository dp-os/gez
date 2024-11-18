import path from 'node:path';

export type ProjectPath =
    | './'
    | 'dist'
    | 'dist/index.js'
    | 'dist/package.json'
    | 'dist/client'
    | 'dist/client/manifest.json'
    | 'dist/client/versions'
    | 'dist/client/versions/latest.json'
    | 'dist/server'
    | 'dist/server/manifest.json'
    | 'dist/node'
    | 'dist/node/src/entry.node.js'
    | 'src'
    | 'src/entry.node.ts'
    | 'src/entry.client.ts'
    | 'src/entry.server.ts'
    | 'package.json';

export function resolvePath(
    root: string,
    projectPath: ProjectPath,
    ...args: string[]
): string {
    return path.resolve(root, projectPath, ...args);
}
