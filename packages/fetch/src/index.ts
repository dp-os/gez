/*

专门为 gez 框架提供远程的下载库，具有缓存功能。

例子：

const urls = [
    'ssr-html/versions/latest.tgz',
    'ssr-html/versions/1.0.tgz',
];

const outputDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'output');

fetchPkgsWithProgress({
    baseURL: 'https://dp-os.github.io/gez/',
    urls,
    outputPaths: urls.map(url => path.join(outputDir, 'output', url.split('/')[0] + '.tgz')),
    returnLevel: 1,
    timeout: 4500,
}).then((...args) => {
    console.log(...args);
});

 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { MultiBar, type SingleBar } from 'cli-progress';

export interface FetchPkgWithCacheOptions extends AxiosRequestConfig {
    /**
     * 缓存文件夹路径 默认为 `.root/packages`
     */
    cacheDir?: string;
    /**
     * 是否不使用缓存 默认为 `false` (即默认使用缓存)
     * 现在的逻辑是不使用缓存时，不校验 hash 值。
     */
    noCache?: boolean;
    /**
     * 输出的文件路径 (包含文件名)。
     * 缺省时不输出文件，如果使用缓存会下载到缓存，否则报错 `outputPath is empty`。
     * 目前，如果不使用缓存，会直接下载到 `outputPath`，且不进行 hash 校验。
     */
    outputPath?: string;
    /**
     * 日志输出函数 默认为 `console.log`
     * @param str string 输出的字符串
     * @returns void
     */
    logger?: (str: string) => void;
}

export type FetchResult = {
    /**
     * 资源是从哪个 URL 获取的
     */
    url: string;
} & (
    | {
          hasError: false;
          /**
           * 输出的文件路径
           * 如果无 outputPath，且使用缓存，则为缓存文件路径。
           */
          filePath: string;
          /**
           * 缓存文件路径 默认为 `{cachePath}/prj/path/filename-hash.ext`
           * 如果不使用缓存，则为空字符串。
           */
          cacheFilePath: string;
          /**
           * 文件 hash 值
           * 如果不使用缓存/无校验文件时，则为空字符串。
           */
          hash: string;
          /**
           * 是否命中缓存
           * 如果不使用缓存，则必定为 `false`。
           */
          hitCache: boolean;
      }
    | {
          hasError: true;
          /**
           * 错误信息
           */
          error: Error;
      }
);

/**
 * 获取文件，并缓存到本地。如果有缓存则使用缓存
 */
export async function fetchPkgWithCache({
    cacheDir = '.root/packages',
    noCache = false,
    outputPath = '',
    logger = console.log,
    ...axiosOptions
}: FetchPkgWithCacheOptions): Promise<FetchResult> {
    const url = new URL(axiosOptions.url || '', axiosOptions.baseURL).href;
    logger(`[fetch] Start ${url}`);
    const pathInfo = path.parse(new URL(url).pathname);

    if (outputPath && !fs.existsSync(path.dirname(outputPath)))
        await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });

    if (!noCache) {
        cacheDir = path.join(cacheDir, pathInfo.dir);
        if (!fs.existsSync(cacheDir))
            await fs.promises.mkdir(cacheDir, { recursive: true });
    }

    /*
        获取 hash。使用缓存时，一定要有 hash 值。
        现在的逻辑是不使用缓存时，不校验 hash 值。
        TODO: 理论上应该将《是否使用缓存》和《是否校验》分开，以后再说吧。
    */
    const hashUrl = url.replace(new RegExp(path.extname(url) + '$'), '.txt');
    let hash = '';
    if (!noCache)
        try {
            hash = (
                await axios.get(hashUrl, {
                    ...axiosOptions,
                    responseType: 'text'
                })
            ).data;
        } catch (error: any) {
            logger(`[fetch] Get hash error ${url}: ${error.message}`);
            return { url, hasError: true, error };
        }
    const cacheFilePath = path.join(
        cacheDir,
        pathInfo.name + '-' + hash + pathInfo.ext
    );
    if (hash && fs.existsSync(cacheFilePath)) {
        logger(`[fetch] Hit cache ${url}: ${cacheFilePath}`);
        if (outputPath) await fs.promises.cp(cacheFilePath, outputPath);
        return {
            url,
            hasError: false,
            cacheFilePath,
            filePath: outputPath || cacheFilePath,
            hash,
            hitCache: true
        };
    }

    // 下载文件
    // TODO: 加入断点续传功能
    let result: AxiosResponse | null = null;
    try {
        result = await axios.get(url, {
            ...axiosOptions,
            responseType: 'stream'
        });
    } catch (error: any) {
        logger(`[fetch] Error ${url}: ${error.message}`);
        return { url, hasError: true, error };
    }

    // 不使用缓存时/无hash文件时 直接下载到 outputPath，且不进行校验
    if (noCache || !hash) {
        if (outputPath === '') {
            return {
                url,
                hasError: true,
                error: new Error('outputPath is empty')
            };
        }
        const fileStream = fs.createWriteStream(outputPath);
        const streamPromise = new Promise((resolve, reject) => {
            fileStream.on('finish', resolve);
            fileStream.on('error', reject);
        });
        result?.data.pipe(fileStream);
        try {
            await streamPromise;
        } catch (error: any) {
            logger(`[fetch] Write file error ${url}: ${error.message}`);
            return { url, hasError: true, error };
        }
        logger(`[fetch] Downloaded without cache ${url}: ${outputPath}`);
        return {
            url,
            hasError: false,
            cacheFilePath: outputPath,
            filePath: outputPath,
            hash,
            hitCache: false
        };
    }

    /*
        使用缓存时
        这里先将文件下载到 pathInfo.base + '.tmp'，然后下载时同步校验 hash 值.
        这样在校验失败时，或者下载未完成时，不会将错误的文件保存到缓存中。
        校验成功后，重命名为 pathInfo.name + '-' + hash + pathInfo.ext
    */
    const hashStream = crypto.createHash('sha256');
    const tmpFilePath = path.join(cacheDir, pathInfo.base + '.tmp');
    const fileStream = fs.createWriteStream(tmpFilePath);
    const streamPromise = new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
    });
    result?.data.on('data', (chunk: crypto.BinaryLike) => {
        hashStream.update(chunk);
        fileStream.write(chunk);
    });
    result?.data.on('end', () => fileStream.end());
    try {
        await streamPromise;
    } catch (error: any) {
        logger(`[fetch] Write tmp file error ${url}: ${error.message}`);
        return { url, hasError: true, error };
    }
    if (hashStream.digest('hex') !== hash) {
        logger(`[fetch] Hash not match ${url}: ${hash}`);
        await fs.promises.rm(cacheFilePath, { force: true });
        return { url, hasError: true, error: new Error('Hash not match') };
    }
    await fs.promises.rename(tmpFilePath, cacheFilePath);
    if (outputPath) await fs.promises.cp(cacheFilePath, outputPath);

    logger(`[fetch] Downloaded ${url}: ${cacheFilePath}`);
    return {
        url,
        hasError: false,
        cacheFilePath,
        filePath: outputPath,
        hash,
        hitCache: false
    };
}

export interface FetchPkgs extends AxiosRequestConfig {
    /**
     * 是否不使用缓存 默认为 `false` (即默认使用缓存)
     * 现在的逻辑是不使用缓存时，不校验 hash 值。
     */
    noCache?: boolean;
    /**
     * 缓存文件路径 默认为 `.root/packages`
     */
    cacheDir?: string;
    /**
     * 要获取的 URL 列表
     */
    urls: string[];
    /**
     * 输出的文件路径 (包含文件名)。
     * 缺省时不输出文件，如果使用缓存会下载到缓存，否则报错 `outputPath is empty`。
     * 目前，如果不使用缓存，会直接下载到 `outputPath`，且不进行 hash 校验。
     */
    outputPaths?: string[];
    /**
     * 用于单独指定不同 URL 的配置。
     * 其他的都是全局配置，这里的配置会根据指定的 URL 来覆盖全局配置。
     */
    specificOptions?: {
        [url: string]: FetchPkgs & {
            /**
             * 输出的文件路径 (包含文件名)。
             * 缺省时不输出文件，如果使用缓存会下载到缓存，否则报错 `outputPath is empty`。
             * 目前，如果不使用缓存，会直接下载到 `outputPath`，且不进行 hash 校验。
             */
            outputPath?: string;
        };
    };
    /**
     * 返回结果的级别 默认为 `2` (即默认返回详细结果)
     * `0`: 如果没有发生任何错误，返回 `true`，否则返回 `false`；
     * `1`: 根据 urls 顺序，返回 `boolean[]`，表示是否成功；
     * `2`: 返回详细结果。
     */
    returnLevel?: number;
}

export type FetchPkgsResult<Level extends number> = Level extends 0
    ? boolean
    : Level extends 1
      ? boolean[]
      : FetchResult[];

/**
 * 获取多个文件，并缓存到本地。如果有缓存则使用缓存。带有进度条
 */
export async function fetchPkgsWithProgress<Level extends number>({
    cacheDir = '.root/packages',
    noCache = false,
    urls,
    outputPaths,
    specificOptions,
    returnLevel = 2 as Level,
    ...comAxiosOptions
}: FetchPkgs & { returnLevel?: Level }): Promise<FetchPkgsResult<Level>> {
    const multiBar = new MultiBar({
        stopOnComplete: true,
        format: ' [{bar}] {percentage}% | {eta_formatted}/{duration_formatted} | {value}/{total} | {url}',
        forceRedraw: true,
        barCompleteChar: '#',
        barIncompleteChar: '_'
    });
    const logger = (str = '') => {
        // multiBar.log 最后一个字符需要是换行符
        multiBar.log(str.trimEnd() + '\n');
        multiBar.update(); // force redraw
    };
    const bars: { [url: string]: SingleBar } = urls.reduce((obj, url) => {
        obj[url] = multiBar.create(1, 0, { url });
        return obj;
    }, {});
    // 不知为何，有的时候不会更新，强制每秒重绘一次
    const timer = setInterval(() => multiBar.update(), 1000);
    const results = await Promise.all(
        urls.map((url, idx) =>
            fetchPkgWithCache({
                cacheDir,
                noCache,
                outputPath: outputPaths?.[idx] || '',
                ...comAxiosOptions,
                url,
                ...(specificOptions?.[url] || {}),
                onDownloadProgress(progressEvent) {
                    bars[url].setTotal(
                        progressEvent?.total ?? progressEvent.loaded + 1
                    );
                    bars[url].update(progressEvent.loaded, { url });
                    bars[url].updateETA();
                    if (specificOptions?.[url]?.onDownloadProgress)
                        specificOptions[url].onDownloadProgress(progressEvent);
                    else comAxiosOptions.onDownloadProgress?.(progressEvent);
                },
                logger
            })
        )
    );
    clearInterval(timer);
    multiBar.update(); // force redraw
    multiBar.stop();
    return (
        returnLevel === 0
            ? results.every((r) => !r.hasError)
            : returnLevel === 1
              ? results.map((r) => !r.hasError)
              : results
    ) as FetchPkgsResult<Level>;
}
