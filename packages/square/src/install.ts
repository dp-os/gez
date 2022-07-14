import Vue from 'vue';

import { Micro } from './micro';
import { microRegister, R_NAME, RegisterItem } from './register';
import { Square } from './square';
import { Types } from './types';

/**
 * 安装 mixin
 */
const installMixin = (_Vue: typeof Vue) => {
    _Vue.mixin(microRegister);
};

/**
 * 安装 this.$micro
 */
const installMicro = (_Vue: typeof Vue) => {
    Object.defineProperty(_Vue.prototype, '$micro', {
        get(this: any): Micro {
            if (this.$root && this.$root.$options.micro) {
                return this.$root.$options.micro;
            }
            throw new Error(
                "[micro] Please use 'new Vue({ micro: new Micro({ ... }) })' to install Micro"
            );
        }
    });
};

/**
 * 安装 this.$square
 */
const installSquare = (_Vue: typeof Vue) => {
    Object.defineProperty(_Vue.prototype, '$square', {
        get(this: any): Square {
            if ((this as any)._squareCache) {
                return (this as any)._squareCache;
            }
            const arr: RegisterItem[] = [];
            let cur = this as any;
            while (cur) {
                if (Array.isArray(cur[R_NAME])) {
                    arr.push.apply(arr, cur[R_NAME]);
                }
                cur = cur.$parent;
            }
            const square = new Square();
            const setItem = (name: keyof Types.RegisterOptions, value: any) => {
                // 如果已经注册，则不再重复注册，始终返回离当前组件最近的父组件所注册的模块
                if (name in square) return;
                Object.defineProperty(square, name, {
                    enumerable: true,
                    get() {
                        return value;
                    },
                    set() {
                        // eslint-disable-next-line no-new
                        new Error(
                            `[micro] Modification of ${name} modules is not allowed`
                        );
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
                const rfmm: any = this.$root.$options.square;
                Object.keys(rfmm).forEach((key: string) => {
                    setItem(key as any, rfmm[key]);
                });
            }
            // 如果 _squareCache 属性存在，则代表，模块已经全部注册完成，允许对结果进行缓存
            if ('_squareCache' in this) {
                (this as any)._squareCache = square;
            }
            return square;
        }
    });
};

export const install = (_Vue: typeof Vue) => {
    Micro.setVue(_Vue);
    if ('$micro' in _Vue.prototype) return;
    installMixin(_Vue);
    installMicro(_Vue);
    installSquare(_Vue);
};
