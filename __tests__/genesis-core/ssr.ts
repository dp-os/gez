/* eslint-disable no-undef */
import path from 'path';
import { SSR } from '../../packages/genesis-core/src/ssr';

test('check options.name', async () => {
    const test = new SSR({ name: 'ssr-test' });
    await expect(new SSR().name).toBe('ssr-genesis');
    await expect(test.name).toBe('ssr-test');
    await expect(test.publicPath).toBe('/ssr-test/');
    await expect(test.outputDir).toBe(
        path.resolve(path.resolve(), 'dist/ssr-test')
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
            return expect(ssr[item.label]).toBe(
                path.resolve(baseDir, item.value)
            );
        })
    );
    await expect(ssr.srcIncludes[0]).toBe(ssr.srcDir);
    await expect(ssr.srcIncludes[1]).toBe(
        path.resolve(baseDir, 'dist/ssr-test/src')
    );
});

test('check options.build.outputDir', async () => {
    const outputDir = path.resolve(__dirname, './dist2');
    const ssr = new SSR({
        build: {
            outputDir
        }
    });
    await expect(ssr.outputDir).toBe(path.resolve(__dirname, './dist2'));

    const ssr2 = new SSR({
        build: {
            outputDir: './dist2'
        }
    });
    await expect(ssr2.outputDir).toBe(path.resolve(path.resolve(), './dist2'));
});

test('check options.build.transpile', async () => {
    const re = new RegExp('\\/test\\/');
    let ssr = new SSR({
        build: {
            transpile: [re]
        }
    });
    await expect(ssr.srcIncludes[0]).toBe(re);
    await expect(ssr.transpile[0]).toBe(re);

    ssr = new SSR();
    await expect(ssr.transpile[0].source).toBe('@fmfe\\/genesis-app');
});

test('check options.build.alias', async () => {
    const ssr = new SSR({
        build: {
            alias: {
                vue: 'vue.esm.min.js'
            }
        }
    });
    await expect(ssr.options.build?.alias?.vue).toBe('vue.esm.min.js');
});

test('check options.build.browsers', async () => {
    let ssr = new SSR({
        build: {
            browsers: {
                client: ['ios >= 10'],
                server: ['node >= 12']
            }
        }
    });
    await expect(ssr.getBrowsers('client')).toStrictEqual(['ios >= 10']);
    await expect(ssr.getBrowsers('server')).toStrictEqual(['node >= 12']);

    ssr = new SSR();
    await expect(ssr.getBrowsers('client')).toStrictEqual([
        'ie >= 9',
        'ios >= 5',
        'android >= 4.0'
    ]);
    await expect(ssr.getBrowsers('server')).toStrictEqual([
        `node >= ${process.versions.node}`
    ]);
});

test('check options.build.template', async () => {
    const ssr = new SSR({
        build: {
            template: path.resolve('./html/index.html')
        }
    });
    await expect(ssr.templaceFile).toBe(path.resolve('./html/index.html'));
});

test('check options.isProd', async () => {
    let ssr = new SSR({
        isProd: false
    });
    await expect(ssr.isProd).toBeFalsy();
    ssr = new SSR({
        isProd: true
    });
    await expect(ssr.isProd).toBeTruthy();
    ssr = new SSR();
    await expect(ssr.isProd).toBe(process.env.NODE_ENV === 'production');
});

test('check ssr.createRenderer()', async () => {
    const ssr = new SSR();
    await expect(() => ssr.createRenderer()).toThrowError(
        `You have not built the application, please execute 'new Build(ssr).start()' build first`
    );
});
