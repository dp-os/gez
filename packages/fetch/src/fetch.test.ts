import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'vitest';
import { fetchPkgsWithProgress } from '.';

test('base', async () => {
    const urls = ['ssr-html/versions/latest.tgz', 'ssr-html/versions/1.0.tgz'];
    const outputDir = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        'output'
    );
    await fetchPkgsWithProgress({
        baseURL: 'https://dp-os.github.io/gez/',
        urls,
        outputPaths: urls.map((url) =>
            path.join(outputDir, 'output', url.split('/')[0] + '.tgz')
        ),
        returnLevel: 1,
        timeout: 4500
    }).then((...args) => {
        console.log(...args);
    });
}, 5000);
