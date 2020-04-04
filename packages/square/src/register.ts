import Vue from 'vue';
import { Square } from './square';
import { Types } from './types';

export const R_NAME = '_MicroRegisterSquare';

export const forEachSquare = (
    square: Types.PartialSquare | undefined,
    cb: (square: Types.PartialSquare, name: string) => void
) => {
    if (square && typeof square === 'object') {
        Object.keys(square).forEach((name: string) => {
            if (typeof (square as any)[name] === 'function') {
                cb(square, name);
            }
        });
    }
};

export interface RegisterItem {
    rid: Types.Rid;
    name: string;
}

export const microRegister = {
    beforeCreate(this: Vue) {
        // 添加一次使用的记录
        const micro = this.$options.micro;
        if (micro) {
            micro.addUse();
        }
        // 安装
        forEachSquare(this.$options.register, (squares, name) => {
            const install = squares[name];
            if (!install) return;
            const v = install(
                this.$parent ? this.$parent.$square : new Square()
            );
            if (typeof v === 'undefined') return;
            const rid: Types.Rid = this.$micro.register(name, v);
            const arr: RegisterItem[] = (this as any)[R_NAME] || [];
            arr.push({
                rid,
                name
            });
            (this as any)[R_NAME] = arr;
        });
        // 模块已经全部注册完成，允许 this.$square 的结果进行缓存
        (this as any)._squareCache = null;
    },
    destroyed(this: Vue) {
        if (Array.isArray((this as any)[R_NAME])) {
            (this as any)[R_NAME].forEach((item: RegisterItem) => {
                this.$micro.unregister(item.name, item.rid);
            });
        }
        const micro = this.$options.micro;
        if (!micro) return;
        micro.reduceUse();
        if (!micro.isUse) {
            micro.destroy();
        }
    }
};
