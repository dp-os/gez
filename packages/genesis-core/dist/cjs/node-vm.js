"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeVM = void 0;
const fs_1 = __importDefault(require("fs"));
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
const vm_1 = __importDefault(require("vm"));
class NodeVM {
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
        const code = module_1.default.wrap(fs_1.default.readFileSync(filename, { encoding: 'utf-8' }));
        const factory = vm_1.default.runInNewContext(code, this.sandbox, {
            filename,
            displayErrors: true
        });
        const dirname = path_1.default.dirname(filename);
        const module = { exports: {} };
        const _require = (id) => {
            if (path_1.default.isAbsolute(id)) {
                return this._require(id);
            }
            const filename = path_1.default.posix.join(dirname, id);
            if (fs_1.default.existsSync(filename)) {
                return this._require(filename);
            }
            return require(id);
        };
        factory.call(module.exports, module.exports, _require, module, filename, dirname);
        files[id] = module.exports;
        return module.exports;
    }
}
exports.NodeVM = NodeVM;
