"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const micro_1 = require("./micro");
const square_1 = require("./square");
const register_1 = require("./register");
/**
 * 安装 mixin
 */
const installMixin = (_Vue) => {
    _Vue.mixin(register_1.microRegister);
};
/**
 * 安装 this.$micro
 */
const installMicro = (_Vue) => {
    Object.defineProperty(_Vue.prototype, '$micro', {
        get() {
            if (this.$root && this.$root.$options.micro) {
                return this.$root.$options.micro;
            }
            throw new Error("[micro] Please use 'new Vue({ micro: new Micro({ ... }) })' to install Micro");
        }
    });
};
/**
 * 安装 this.$square
 */
const installSquare = (_Vue) => {
    Object.defineProperty(_Vue.prototype, '$square', {
        get() {
            if (this._squareCache) {
                return this._squareCache;
            }
            const arr = [];
            let cur = this;
            while (cur) {
                if (Array.isArray(cur[register_1.R_NAME])) {
                    arr.push.apply(arr, cur[register_1.R_NAME]);
                }
                cur = cur.$parent;
            }
            const square = new square_1.Square();
            const setItem = (name, value) => {
                // 如果已经注册，则不再重复注册，始终返回离当前组件最近的父组件所注册的模块
                if (name in square)
                    return;
                Object.defineProperty(square, name, {
                    enumerable: true,
                    get() {
                        return value;
                    },
                    set() {
                        // eslint-disable-next-line no-new
                        new Error(`[micro] Modification of ${name} modules is not allowed`);
                    }
                });
            };
            // 优先级高的先写入
            arr.forEach((item) => {
                const module = this.$micro.getModule(item.rid);
                setItem(item.name, module);
            });
            // 优先极低的后写入
            if (this.$root && this.$root.$options.square) {
                const rfmm = this.$root.$options.square;
                Object.keys(rfmm).forEach((key) => {
                    setItem(key, rfmm[key]);
                });
            }
            // 如果 _squareCache 属性存在，则代表，模块已经全部注册完成，允许对结果进行缓存
            if ('_squareCache' in this) {
                this._squareCache = square;
            }
            return square;
        }
    });
};
const install = (_Vue) => {
    micro_1.Micro.setVue(_Vue);
    if ('$micro' in _Vue.prototype)
        return;
    installMixin(_Vue);
    installMicro(_Vue);
    installSquare(_Vue);
};
exports.install = install;
