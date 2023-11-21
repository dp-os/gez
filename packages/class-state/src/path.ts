import queryString from 'query-string';
export function createFullPath (name: string, params?: unknown) {
    if (params) {
        if (typeof params ==='object') {
            return name + '?' + queryString.stringify(params);
        }
        return `${name}?${params}`
    }
    return name;
}