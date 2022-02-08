/**
 * 删除目录的缓存
 */
export function deleteRequireDirCache(baseDir: string) {
    const isProd = process.env.NODE_ENV === 'production';
    const arr: string[] = [];
    Object.keys(require.cache).forEach((filename) => {
        if (filename.startsWith(baseDir)) {
            delete require.cache[filename];
            if (!isProd) {
                arr.push(filename);
            }
        }
    });
    if (!isProd && arr.length) {
        console.log(`deleted require.cache:\n${arr.join('\n')}`);
    }
}
