import fs from 'node:fs';
import path from 'node:path';
import write from 'write';

interface PkgFileItem {
    title: string;
    name: string;
}

interface PkgItem {
    title: string;
    name: string;
    input: string;
    files: PkgFileItem[];
}

const list: PkgItem[] = [
    {
        title: '@gen/core',
        input: path.resolve('../../packages/core/dist'),
        name: 'core',
        files: [
            {
                title: 'Gez',
                name: 'gez'
            },
            {
                title: 'ModuleConfig',
                name: 'module-config'
            },
            {
                title: 'PackConfig',
                name: 'pack-config'
            },
            {
                title: 'App',
                name: 'app'
            },
            {
                title: 'RenderContext',
                name: 'render-context'
            },
            {
                title: 'Middleware',
                name: 'middleware'
            },
            {
                title: 'ManifestJson',
                name: 'manifest-json'
            }
        ]
    },
    {
        title: '@gen/rspack',
        input: path.resolve('../../packages/rspack/dist'),
        name: 'rspack',
        files: [
            {
                title: 'App',
                name: 'app'
            },
            {
                title: 'BuildTarget',
                name: 'build-target'
            },
            {
                title: 'HtmlApp',
                name: 'html-app'
            }
        ]
    },
    {
        title: '@gen/rspack-vue',
        input: path.resolve('../../packages/rspack-vue/dist'),
        name: 'rspack-vue',
        files: [
            {
                title: 'Vue',
                name: 'vue'
            }
        ]
    }
];

const GENERATE_ROOT = path.resolve(process.cwd(), 'src/api');

export function generateDts() {
    list.forEach((item) => {
        item.files.forEach((fileItem) => {
            generateMdxByPkgFile(item, fileItem);
        });
        generateMetaByPkg(item);
    });
    generateMeta(list);
}

function generateMdxByPkgFile(item: PkgItem, fileItem: PkgFileItem) {
    const sourceFile = path.resolve(item.input, fileItem.name + '.d.ts');
    const targetFile = path.resolve(
        GENERATE_ROOT,
        item.name,
        fileItem.name + '.mdx'
    );
    const text = fs.readFileSync(sourceFile, 'utf-8');
    write.sync(
        targetFile,
        `
# ${fileItem.title}

## 类型
\`\`\`ts
${text}
\`\`\`

`
    );
}
function generateMetaByPkg(item: PkgItem) {
    const meta = item.files.map((item) => item.name);
    write.sync(
        path.resolve(GENERATE_ROOT, item.name, '_meta.json'),
        JSON.stringify(meta, null, 4)
    );
}

function generateMeta(list: PkgItem[]) {
    const meta = list.map((item) => {
        return {
            type: 'dir',
            name: item.name,
            label: item.title
        };
    });
    write.sync(
        path.resolve(GENERATE_ROOT, '_meta.json'),
        JSON.stringify(meta, null, 4)
    );
}
