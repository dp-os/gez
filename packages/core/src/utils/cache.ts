/**
 * 缓存处理函数的类型定义
 *
 * @template T - 缓存数据的类型
 * @param name - 缓存项的唯一标识符
 * @param fetch - 获取数据的异步函数
 * @returns 返回缓存的数据或新获取的数据
 *
 * @example
 * ```ts
 * const cache = createCache(true);
 *
 * // 第一次调用会执行 fetch 函数
 * const data1 = await cache('key', async () => {
 *   return await fetchSomeData();
 * });
 *
 * // 第二次调用会直接返回缓存的结果
 * const data2 = await cache('key', async () => {
 *   return await fetchSomeData();
 * });
 * ```
 */
export type CacheHandle = <T>(
    name: string,
    fetch: () => Promise<T>
) => Promise<T>;

/**
 * 创建一个缓存处理函数
 *
 * @param enable - 是否启用缓存功能
 * @returns 返回一个缓存处理函数
 *
 * @description
 * 当 enable 为 true 时，会创建一个带有内存缓存的处理函数，相同的 name 只会执行一次 fetch。
 * 当 enable 为 false 时，每次调用都会执行 fetch 函数，不会缓存结果。
 *
 * @example
 * ```ts
 * // 创建一个启用缓存的处理函数
 * const cacheEnabled = createCache(true);
 *
 * // 创建一个禁用缓存的处理函数
 * const cacheDisabled = createCache(false);
 *
 * // 使用缓存处理函数
 * const result = await cacheEnabled('userProfile', async () => {
 *   return await fetchUserProfile(userId);
 * });
 * ```
 */
export function createCache(enable: boolean) {
    if (enable) {
        const map = new Map<string, any>();
        return async <T>(name: string, fetch: () => Promise<T>): Promise<T> => {
            if (map.has(name)) {
                return map.get(name);
            }
            const result = await fetch();
            map.set(name, result);
            return result;
        };
    }
    return <T>(name: string, fetch: () => Promise<T>): Promise<T> => {
        return fetch();
    };
}
