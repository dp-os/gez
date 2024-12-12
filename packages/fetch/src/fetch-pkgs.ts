import { MultiBar } from 'cli-progress';

import { fetchPkg } from './fetch-pkg';
import type {
    FetchPkgOptions,
    FetchPkgWithBarLogger,
    FetchPkgWithBarOptions,
    FetchPkgsOptions,
    FetchPkgsWithBarOptions,
    FetchResult,
    FetchResults
} from './types';

/**
 * 获取多个文件，并缓存到本地。如果有缓存则使用缓存。
 */
export async function fetchPkgs<Level extends number>({
    packs,
    returnLevel = 2 as Level,
    ...options
}: FetchPkgsOptions & { returnLevel?: Level }): Promise<FetchResults<Level>> {
    if (new Set(packs.map((pack) => pack.name)).size !== packs.length) {
        return (
            returnLevel === 0
                ? false
                : returnLevel === 1
                  ? packs.map(() => false)
                  : packs.map(() => ({
                        hasError: true,
                        name: '',
                        url: '',
                        error: new Error('Duplicate name')
                    }))
        ) as FetchResults<Level>;
    }
    const axiosReqCfg = options.axiosReqCfg || {};
    const results = await Promise.all(
        packs.map((pack) =>
            fetchPkg({
                ...options,
                returnLevel,
                ...pack,
                axiosReqCfg: {
                    ...axiosReqCfg,
                    ...(pack.axiosReqCfg || {})
                }
            })
        )
    );
    return (
        returnLevel === 0
            ? results.every((r) => !r)
            : returnLevel === 1
              ? (results as FetchResult<1>[]).map((r) => !r.hasError)
              : results
    ) as FetchResults<Level>;
}

/**
 * 获取多个文件，并缓存到本地。如果有缓存则使用缓存。带有进度条
 */
export async function fetchPkgsWithBar<Level extends number>({
    packs,
    axiosReqCfg = {},
    multiBarCfg = {},
    ...options
}: FetchPkgsWithBarOptions & { returnLevel?: Level }): Promise<
    FetchResults<Level>
> {
    const multiBar = new MultiBar({
        stopOnComplete: true,
        format: ' [{bar}] {percentage}% | {name}',
        forceRedraw: true,
        barCompleteChar: '#',
        barIncompleteChar: '_',
        autopadding: true,
        ...multiBarCfg
    });
    const multiBarLogger = (str = '') => {
        // multiBar.log 最后一个字符需要是换行符
        multiBar.log(str.trimEnd() + '\n');
        multiBar.update(); // force redraw
    };
    const bars = packs.reduce((obj, { name }) => {
        obj[name] = multiBar.create(1, 0, { name });
        return obj;
    }, {});
    // 不知为何，有的时候不会更新，强制每秒重绘一次
    const timer = setInterval(() => multiBar.update(), 1000);
    const fetchPkgsPacks = packs.map((pack) => {
        const ans = pack as FetchPkgWithBarOptions | FetchPkgOptions;
        ans.axiosReqCfg = ans.axiosReqCfg || {};
        const onDownloadProgress =
            ans.axiosReqCfg.onDownloadProgress ||
            axiosReqCfg?.onDownloadProgress;
        ans.axiosReqCfg.onDownloadProgress = (progressEvent) => {
            bars[ans.name].setTotal(
                progressEvent?.total ?? progressEvent.loaded + 1
            );
            bars[ans.name].update(progressEvent.loaded, { name: ans.name });
            bars[ans.name].updateETA();
            onDownloadProgress?.(progressEvent);
        };
        if (ans.logger) {
            const orgLogger = ans.logger as FetchPkgWithBarLogger;
            ans.logger = (str = '') => {
                orgLogger(multiBarLogger, str);
            };
        }
        return ans as FetchPkgOptions;
    });
    const results = await fetchPkgs({
        packs: fetchPkgsPacks,
        ...options,
        axiosReqCfg,
        logger:
            options.logger && ((str) => options.logger?.(multiBarLogger, str))
    });
    clearInterval(timer);
    multiBar.update(); // force redraw
    multiBar.stop();
    return results;
}

export { fetchPkgsWithBar as fetchPkgsWithProgress };
