"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genesis_core_1 = require("@fmfe/genesis-core");
const mergeArr = (data, cb) => {
    // 展开成一维数组
    const arr = [data];
    const mergeState = (state, deep) => {
        const remoteArr = state.__remote_view_server_state__ || [];
        if (!remoteArr.length)
            return;
        if (deep > 10) {
            throw new Error('Remote view call nesting too deep');
        }
        remoteArr.forEach((item) => {
            if (!item.id)
                return;
            arr.push(item);
            if (typeof item.state === 'object') {
                mergeState(item.state, ++deep);
            }
        });
    };
    mergeState(data.state, 1);
    return cb(arr);
};
class RemoteFormat extends genesis_core_1.Format {
    constructor() {
        super(...arguments);
        this.scriptSet = new Set();
        this.styleSet = new Set();
    }
    style(data) {
        return mergeArr(data, (arr) => {
            let text = arr.map((item) => item.style).join('');
            text = text.replace(/<link([^>]+)>/g, ($1, $2) => {
                if (this.styleSet.has($2)) {
                    return '';
                }
                this.styleSet.add($2);
                return $1;
            });
            return text;
        });
    }
    script(data) {
        return mergeArr(data, (arr) => {
            let text = arr.map((item) => item.script).join('');
            text = text.replace(/<script([^>]+)>[^<]*<\/script>/g, ($1, $2) => {
                if (this.scriptSet.has($2)) {
                    return '';
                }
                this.scriptSet.add($2);
                return $1;
            });
            return text;
        });
    }
    scriptState(data) {
        return mergeArr(data, (arr) => {
            return arr
                .map((item) => {
                return super.scriptState(item);
            })
                .join('');
        });
    }
}
exports.RemoteFormat = RemoteFormat;
class RemotePlugin extends genesis_core_1.Plugin {
    constructor(ssr) {
        super(ssr);
        ssr.Format = RemoteFormat;
    }
    async renderBefore(context) {
        context.format = new RemoteFormat(this.ssr);
    }
}
exports.RemotePlugin = RemotePlugin;
