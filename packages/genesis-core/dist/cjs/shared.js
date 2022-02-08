"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequireDirCache = void 0;
/**
 * 删除目录的缓存
 */
function deleteRequireDirCache(baseDir) {
    Object.keys(require.cache).forEach((filename) => {
        if (filename.startsWith(baseDir)) {
            delete require.cache[filename];
        }
    });
}
exports.deleteRequireDirCache = deleteRequireDirCache;
