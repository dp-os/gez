"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeRender = void 0;
const mergeArr = (data, cb) => {
    // 展开成一维数组
    const arr = [data];
    const mergeState = (state, deep) => {
        const remoteArr = state.__remote_view_state__ || [];
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
exports.beforeRender = (context) => {
    const scriptSet = new Set();
    const styleSet = new Set();
    // js 去重
    context.data.script = mergeArr(context.data, (arr) => {
        let text = arr.map((item) => item.script).join('');
        text = text.replace(/<script([^>]+)>[^<]*<\/script>/g, ($1, $2) => {
            if (scriptSet.has($2)) {
                return '';
            }
            scriptSet.add($2);
            return $1;
        });
        return text;
    });
    // css 去重
    context.data.style = mergeArr(context.data, (arr) => {
        let text = arr.map((item) => item.style).join('');
        text = text.replace(/<link([^>]+)>/g, ($1, $2) => {
            if (styleSet.has($2)) {
                return '';
            }
            styleSet.add($2);
            return $1;
        });
        return text;
    });
};
