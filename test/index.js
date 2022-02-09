const vm = require('vm');
const path = require('path');
const fs = require('fs');
const NativeModule = require('module');

class NodeVM {
    constructor(filename, sandbox = {}) {
        this.filename = filename;
        this.sandbox = sandbox;
        this.dirname = path.dirname(filename);
        this.files = {};
    }
    run() {
        this._require(this.filename);
    }
    destroy() { }
    _require(id) {
        const files = this.files;
        if (files[id]) {
            return files[id];
        }
        const filename = require.resolve(id);
        const code = NativeModule.wrap(fs.readFileSync(filename));

        const factory = vm.runInNewContext(code, this.sandbox, {
            filename: filename,
            displayErrors: true
        });
        const dirname = path.dirname(filename);
        const module = { exports: {}};
        const _require = (id) => {
            if (path.isAbsolute(id)) {
                return this._require(id);
            }
            return this._require(path.resolve(dirname, id));
        }
        factory.call(module.exports, module.exports, _require, module, filename, dirname);

        files[id] = module.exports;
        return module.exports;
    }

}

const nodeVN = new NodeVM('./test', {
    console,
    setInterval
});

nodeVN.run();