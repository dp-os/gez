"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beforeRender = void 0;
var mergeArr = function (data, cb) {
    // 展开成一维数组
    var arr = [data];
    var mergeState = function (state, deep) {
        var remoteArr = state.__remote_view_state__ || [];
        if (!remoteArr.length)
            return;
        if (deep > 10) {
            throw new Error('Remote view call nesting too deep');
        }
        remoteArr.forEach(function (item) {
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
exports.beforeRender = function (context) {
    var scriptSet = new Set();
    var styleSet = new Set();
    // js 去重
    context.data.script = mergeArr(context.data, function (arr) {
        var text = arr.map(function (item) { return item.script; }).join('');
        text = text.replace(/<script([^>]+)>[^<]*<\/script>/g, function ($1, $2) {
            if (scriptSet.has($2)) {
                return '';
            }
            scriptSet.add($2);
            return $1;
        });
        return text;
    });
    // css 去重
    context.data.style = mergeArr(context.data, function (arr) {
        var text = arr.map(function (item) { return item.style; }).join('');
        text = text.replace(/<link([^>]+)>/g, function ($1, $2) {
            if (styleSet.has($2)) {
                return '';
            }
            styleSet.add($2);
            return $1;
        });
        return text;
    });
};
