/* eslint-disable no-undef */
import path from 'path';
import { SSR } from '@fmfe/genesis-core';

test('check options.name', async () => {
    const test = new SSR({ name: 'ssr-test' });
    await expect(new SSR().name).toBe('ssr-genesis');
    await expect(test.name).toBe('ssr-test');
    await expect(test.publicPath).toBe('/ssr-test/');
    await expect(test.outputDir).toBe(
        path.resolve(__dirname, '../dist/ssr-test')
    );
    await expect(
        () => new SSR({ name: (10000 as any) as string }).name
    ).toThrowError('Options.name can only be of string type');
});

test('check options.build.baseDir', async () => {
    const baseDir = path.resolve(__dirname, './ssr-test');
    const ssr = new SSR({
        name: 'ssr-test',
        build: {
            baseDir
        }
    });
    const arr: { label: keyof SSR; value: string }[] = [
        {
            label: 'baseDir',
            value: ''
        },
        {
            label: 'outputDir',
            value: 'dist/ssr-test'
        },
        {
            label: 'outputDirInClient',
            value: 'dist/ssr-test/client'
        },
        {
            label: 'outputDirInServer',
            value: 'dist/ssr-test/server'
        },
        {
            label: 'staticDir',
            value: 'dist/ssr-test/client'
        },
        {
            label: 'srcDir',
            value: 'src'
        },
        {
            label: 'entryClientFile',
            value: 'dist/ssr-test/src/entry-client'
        },
        {
            label: 'entryServerFile',
            value: 'dist/ssr-test/src/entry-server'
        },
        {
            label: 'outputClientManifestFile',
            value: 'dist/ssr-test/server/vue-ssr-client-manifest.json'
        },
        {
            label: 'outputServerBundleFile',
            value: 'dist/ssr-test/server/vue-ssr-server-bundle.json'
        },
        {
            label: 'templaceFile',
            value: 'src/index.html'
        },
        {
            label: 'outputTemplaceFile',
            value: 'dist/ssr-test/server/index.html'
        }
    ];
    await Promise.all(
        arr.map((item) => {
            console.log(item.label);
            return expect(ssr[item.label]).toBe(
                path.resolve(baseDir, item.value)
            );
        })
    );
});
