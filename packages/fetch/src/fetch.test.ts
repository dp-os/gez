import { test } from 'vitest';
import { fetchPkgsWithProgress } from '.';

test('base', async () => {
    await fetchPkgsWithProgress({
        baseURL: 'https://dp-os.github.io/gez/',
        urls: ['ssr-html/versions/latest.tgz', 'ssr-html/versions/1.0.tgz'],
        timeout: 4500
    }).then((...args) => {
        console.log(...args);
    });
}, 5000);
