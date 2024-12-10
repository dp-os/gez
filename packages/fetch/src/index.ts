/*

完成远程依赖下载实现。
从网络或本地获取文件，并缓存到本地。如果有缓存则使用缓存。

例子：

fetchPkgsWithProgress({
    baseURL: 'https://dp-os.github.io/gez/',
    urls: [
        'ssr-html/versions/latest.tgz',
        'ssr-html/versions/1.0.tgz',
    ],
}).then((...args) => {
    console.log(...args);
});

 */

import fs from 'node:fs';
import path from 'node:path';
import { URL } from 'node:url';
import axios, { type AxiosResponse, type AxiosRequestConfig } from 'axios';
import { MultiBar, type SingleBar } from 'cli-progress';

export interface FetchPkgWithCacheOptions extends AxiosRequestConfig {
    /**
     * 缓存文件路径 默认为 .root/packages
     */
    cachePath?: string;
    /**
     * 日志输出函数 默认为 console.log
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
          /**
           * 缓存文件路径 默认为 {cachePath}/prj/path/filename-hash.ext
           */
          cacheFilePath: string;
          /**
           * 文件 hash 值
           */
          hash: string;
          /**
           * 是否命中缓存
           */
          hitCache: boolean;
      }
    | {
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
    cachePath = '.root/packages',
    logger = console.log,
    ...axiosOptions
}: FetchPkgWithCacheOptions): Promise<FetchResult> {
    const url = (axiosOptions.baseURL || '') + axiosOptions.url || '';
    logger(`[fetch] Start ${url}`);
    const pathInfo = path.parse(new URL(url).pathname);
    const pkgPath = path.join(cachePath, pathInfo.dir);

    if (!fs.existsSync(pkgPath)) fs.mkdirSync(pkgPath, { recursive: true });

    // 获取 hash
    const hashUrl = url.replace(new RegExp(path.extname(url) + '$'), '.txt');
    let hash = '';
    try {
        hash = (
            await axios.get(hashUrl, {
                ...axiosOptions,
                responseType: 'text'
            })
        ).data;
    } catch (error: any) {
        logger(`[fetch] Get hash error ${url}: ${error.message}`);
        return { url, error };
    }
    const cacheFilePath = path.join(
        pkgPath,
        pathInfo.name + '-' + hash + pathInfo.ext
    );
    if (fs.existsSync(cacheFilePath)) {
        logger(`[fetch] Hit cache ${url}: ${cacheFilePath}`);
        return { url, cacheFilePath, hash, hitCache: true };
    }

    // 下载文件
    let result: AxiosResponse | null = null;
    try {
        result = await axios.get(url, {
            ...axiosOptions,
            responseType: 'stream'
        });
    } catch (error: any) {
        logger(`[fetch] Error ${url}: ${error.message}`);
        return { url, error };
    }
    const fileStream = fs.createWriteStream(cacheFilePath);
    const streamPromise = new Promise((resolve, reject) => {
        fileStream.on('finish', resolve);
        fileStream.on('error', reject);
    });
    result?.data.pipe(fileStream);
    await streamPromise;

    logger(`[fetch] Downloaded ${url}: ${cacheFilePath}`);
    return { url, cacheFilePath, hash, hitCache: false };
}

export interface FetchPkgsWithProgressOptions extends AxiosRequestConfig {
    /**
     * 缓存文件路径 默认为 .root/packages
     */
    cachePath?: string;
    /**
     * 要获取的 URL 列表
     */
    urls: string[];
    /**
     * axios 配置字典，用于指定不同 URL 的配置
     */
    axiosOptions?: { [url: string]: AxiosRequestConfig };
}

/**
 * 获取多个文件，并缓存到本地。如果有缓存则使用缓存。带有进度条
 */
export async function fetchPkgsWithProgress({
    cachePath = '.root/packages',
    urls,
    axiosOptions,
    ...comAxiosOptions
}: FetchPkgsWithProgressOptions): Promise<FetchResult[]> {
    const multiBar = new MultiBar({
        stopOnComplete: true,
        format: ' [{bar}] {percentage}% | {eta_formatted}/{duration_formatted} | {value}/{total} | {url}',
        forceRedraw: true,
        barCompleteChar: '#',
        barIncompleteChar: '_'
    });
    const logger = (str = '') => {
        // multiBar.log 最后一个字符需要是换行符
        multiBar.log(str.replace(/\n+$/, '') + '\n');
        multiBar.update(); // force redraw
    };
    const bars: { [url: string]: SingleBar } = urls.reduce(
        (obj, url) => ({
            ...obj,
            [url]: multiBar.create(1, 0, { url })
        }),
        {}
    );
    // 不知为何，有的时候不会更新，强制每秒重绘一次
    const timer = setInterval(() => multiBar.update(), 1000);
    const results = await Promise.all(
        urls.map((url) =>
            fetchPkgWithCache({
                cachePath,
                ...comAxiosOptions,
                ...(axiosOptions?.[url] || {}),
                url,
                onDownloadProgress(progressEvent) {
                    // logger(`${progressEvent.loaded}/${progressEvent?.total ?? progressEvent.loaded + 1} ${url}`);
                    bars[url].setTotal(
                        progressEvent?.total ?? progressEvent.loaded + 1
                    );
                    bars[url].update(progressEvent.loaded, { url });
                    bars[url].updateETA();
                    if (axiosOptions?.[url]?.onDownloadProgress)
                        axiosOptions[url].onDownloadProgress(progressEvent);
                    else comAxiosOptions.onDownloadProgress?.(progressEvent);
                },
                logger
            })
        )
    );
    clearInterval(timer);
    multiBar.update(); // force redraw
    multiBar.stop();
    return results;
}
