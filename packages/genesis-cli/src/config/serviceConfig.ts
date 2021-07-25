import type { Service, ServiceOptions } from '../../types';
import { findConfigDir, injectStart, ROOT } from '../utils';
import { existsSync, emptyDirSync, readFileSync, writeFileSync } from 'fs-extra';
import { join, resolve, isAbsolute } from 'path';
import ejs from 'ejs';

const root = findConfigDir(ROOT);

export const defaultServiceConfig: ServiceOptions = {
    baseDir: './',
    name: 'ssr-genesis',
    port: 8080,
    isProd: false,
    api: '',
    build: {
        baseDir: root
    },
    proxyService: []
};

export const defaultProxy: Service = {
    protocol: 'http',
    host: 'localhost',
    port: 8080,
    api: '/'
}

function getRouterAndAppPath(baseDir: string) {
    baseDir = isAbsolute(baseDir)
        ? baseDir
        : resolve(root, baseDir);
    const routerPaths = [join(baseDir, 'src/router.ts'), join(baseDir, 'src/router.js'), join(baseDir, 'src/router')];
    const routerPath = join(baseDir, 'src/router');
    const appPaths = [join(baseDir, 'src/app.vue'), join(baseDir, 'src/App.vue')];
    const existRouter = routerPaths.find(path => existsSync(path));
    const appPath = appPaths.find(path => existsSync(path));

    if (!existRouter) {
        throw new Error(`The default router ${routerPath} must be exist.`);
    }

    if (!appPath) {
        throw new Error(`The default ${join(root, 'src/App.vue')} must be exist.`);
    }

    return { routerPath, appPath };
}

function createDefaultEntryClient(name: string, baseDir: string) {
    const dir = join(root, '.genesis', name, 'client');
    emptyDirSync(dir);
    const { routerPath, appPath } = getRouterAndAppPath(baseDir);

    const clientTemplate = readFileSync(join(__dirname, '../../template/entry-client.ejs'));

    const clientFile = ejs.render(clientTemplate.toString('utf-8'), {
        routerPath,
        appPath
    });

    const clientFilePath = join(dir, 'entry-client.js');
    writeFileSync(clientFilePath, clientFile);

    return clientFilePath;
}

function createDefaultEntryServer(name: string, baseDir: string) {
    const dir = join(root, '.genesis', name, 'server');
    emptyDirSync(dir);
    const { routerPath, appPath } = getRouterAndAppPath(baseDir);

    const clientTemplate = readFileSync(join(__dirname, '../../template/entry-server.ejs'));

    const clientFile = ejs.render(clientTemplate.toString('utf-8'), {
        routerPath,
        appPath
    });

    const clientFilePath = join(dir, 'entry-server.js');
    writeFileSync(clientFilePath, clientFile);

    return clientFilePath;
}

export function resolveApi(options: ServiceOptions) {
    options.api = options.api.startsWith('/')
        ? options.api
        : '/' + options.api;

    return options.api.replace('[name]', options.name);
}

export function resolveProxy(proxyService: Service[] | Service): Service[] {

    const optionsProxyServices = Array.isArray(proxyService)
        ? proxyService || []
        : [proxyService] as Service[];

    return optionsProxyServices.map(service => {
        return Object.assign({}, defaultProxy, service, {
            api: injectStart(String(service.api), '/')
        })
    })
}

export function resolveConfig(options: ServiceOptions, isModel?: boolean) {
    options = Object.assign({}, defaultServiceConfig, options);

    options.isProd = process.env.NODE_ENV === 'production'
        ? true
        : !!options.isProd;

    if (!options.entryClient) {
        options.entryClient = createDefaultEntryClient(options.name, options.baseDir);
    }

    if (!options.entryServer) {
        options.entryServer = createDefaultEntryServer(options.name, options.baseDir);
    }

    options.api = options.api ? resolveApi(options) : '';

    options.build = Object.assign({}, options.build);
    options.build.baseDir = options.baseDir || './';

    const defaultOutputDir = isModel
        ? join(ROOT, `./dist/${options.name}`)
        : resolve(options.build.baseDir, `./dist/${options.name}`);

    options.build.outputDir = options.build.outputDir
        ? options.build.outputDir
        : defaultOutputDir;

    options.proxyService = resolveProxy(options.proxyService || [])

    return options;
}

export async function validateOptions(options: ServiceOptions) {
    const {
        entryClient,
        entryServer,
        name,
        api,
        build,

    } = options;

    if (entryClient && !existsSync(resolve(ROOT, entryClient))) {
        throw new Error(' EntryClient file is not exist.');
    }

    if (entryServer && !existsSync(resolve(ROOT, entryServer))) {
        throw new Error(' EntryServer file is not exist.');
    }

    if (!/^[\w\-]+$/.test(name)) {
        throw new Error(' The name can only be combination of a-z A-Z 0-9 - _.');
    }


}
