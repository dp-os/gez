export function pathWithoutIndex(imports: Record<string, string>) {
    const suffix = '/index';
    Object.entries(imports).forEach(([key, value]) => {
        if (key.endsWith(suffix)) {
            key = key.substring(0, key.length - suffix.length);
            imports[key] = value;
        }
    });
}
