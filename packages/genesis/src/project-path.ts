import path from 'node:path'

export type ProjectPath =
'dist' |
'dist/client' |
'dist/client/manifest.json' |
'dist/server' |
'dist/server/entry-server.js' |
'dist/node' |
'dist/node/entry-node.js' |

'src' |
'src/entry-node.ts' |
'src/entry-client.ts' |
'src/entry-server.ts'

export function getProjectPath (root: string, projectPath: ProjectPath): string {
  return path.resolve(root, projectPath)
}
