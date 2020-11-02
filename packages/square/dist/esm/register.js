import { Square } from './square';
export const R_NAME = '_MicroRegisterSquare';
export const forEachSquare = (square, cb) => {
    if (square && typeof square === 'object') {
        Object.keys(square).forEach((name) => {
            if (typeof square[name] === 'function') {
                cb(square, name);
            }
        });
    }
};
export const microRegister = {
    beforeCreate() {
        // 添加一次使用的记录
        const micro = this.$options.micro;
        if (micro) {
            micro.addUse();
        }
        // 安装
        forEachSquare(this.$options.register, (squares, name) => {
            const install = squares[name];
            if (!install)
                return;
            const v = install(this.$parent ? this.$parent.$square : new Square());
            if (typeof v === 'undefined')
                return;
            const rid = this.$micro.register(name, v);
            const arr = this[R_NAME] || [];
            arr.push({
                rid,
                name
            });
            this[R_NAME] = arr;
        });
        // 模块已经全部注册完成，允许 this.$square 的结果进行缓存
        this._squareCache = null;
    },
    destroyed() {
        if (Array.isArray(this[R_NAME])) {
            this[R_NAME].forEach((item) => {
                this.$micro.unregister(item.name, item.rid);
            });
        }
        const micro = this.$options.micro;
        if (!micro)
            return;
        micro.reduceUse();
        if (!micro.isUse) {
            micro.destroy();
        }
    }
};
