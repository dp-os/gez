export type CacheHandle = <T>(
    name: string,
    fetch: () => Promise<T>
) => Promise<T>;

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
