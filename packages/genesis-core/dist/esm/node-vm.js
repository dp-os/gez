import fs from 'fs';
import nativeModule from 'module';
import path from 'path';
import vm from 'vm';
export class NodeVM {
    constructor(filename, sandbox = {}) {
        this.filename = filename;
        // TODO: 这里可以使用代理，进一步避免内存泄漏
        this.sandbox = sandbox;
        this.files = {};
    }
    require() {
        return this._require(this.filename);
    }
    destroy() {
        this.files = {};
        this.sandbox = {};
    }
    _require(id) {
        const files = this.files;
        if (files[id]) {
            return files[id];
        }
        const filename = require.resolve(id);
        const code = nativeModule.wrap(fs.readFileSync(filename, { encoding: 'utf-8' }));
        const factory = vm.runInNewContext(code, this.sandbox, {
            filename,
            displayErrors: true
        });
        const dirname = path.dirname(filename);
        const module = { exports: {} };
        const _require = (id) => {
            if (path.isAbsolute(id)) {
                return this._require(id);
            }
            const filename = path.posix.join(dirname, id);
            if (fs.existsSync(filename)) {
                return this._require(filename);
            }
            return require(id);
        };
        factory.call(module.exports, module.exports, _require, module, filename, dirname);
        files[id] = module.exports;
        return module.exports;
    }
}
