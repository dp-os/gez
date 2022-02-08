/**
 * 删除目录的缓存
 */
export function deleteRequireDirCache(baseDir) {
    Object.keys(require.cache).forEach((filename) => {
        if (filename.startsWith(baseDir)) {
            delete require.cache[filename];
        }
    });
}
