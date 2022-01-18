import Tms from '@fmfe/tms.js';
import Vue from 'vue';

import { install } from './install';
import { Types } from './types';

export const log = (log: string) => {
    if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`[micro] ${log}`);
    }
};
const getType = (payload: any): string => {
    return Object.prototype.toString
        .call(payload)
        .replace(/^(.*?) |]$/g, '')
        .toLowerCase();
};

class MicroBase {
    public static install: any = install;
    private static _Vue: typeof Vue | null = null;
    public static setVue(_Vue: typeof Vue) {
        if (this._Vue) return;
        this._Vue = _Vue;
    }

    public static getVue(): typeof Vue {
        const _Vue = this._Vue;
        if (!_Vue) {
            throw new Error('Please install Vue.use(Micro);');
        }
        return _Vue;
    }

    private vm: Vue;
    private rid = 0;
    private useCount = 0;
    public constructor() {
        const self = this;
        this.vm = new Vue({
            data: function () {
                return {
                    $$this: self
                };
            }
        });
        Object.defineProperty(this, 'vm', {
            enumerable: false
        });
        Object.defineProperty(this, 'rid', {
            enumerable: false
        });
        Object.defineProperty(this, 'useCount', {
            enumerable: false
        });
        log('Create examples');
    }

    public addUse() {
        this.useCount++;
    }

    public reduceUse() {
        this.useCount--;
    }

    public get isUse() {
        return this.useCount > 0;
    }

    /**
     * Registration module
     */
    public register(name: string, v: any): Types.Rid {
        const rid: Types.Rid = `${name}_${++this.rid}`;
        Micro.getVue().set(this, rid, v);
        log(`Registration module ${rid}`);
        return rid;
    }

    /**
     * Get module
     */
    public getModule<T>(rid: Types.Rid): T {
        return (this as any)[rid];
    }

    /**
     * Remove module
     */
    public unregister(name: string, rid: Types.Rid) {
        Micro.getVue().delete(this, rid);
        log(`Remove module ${rid}`);
    }

    /**
     * Destroy instance
     */
    public destroy() {
        log('Destroy instance');
        this.vm && this.vm.$destroy();
        (this as any)._vm = null;
    }
}
const deepRecursionTms = (
    target: any,
    rid: string[],
    fn: (target: Tms, path: string) => void
) => {
    if (typeof target !== 'object' || Array.isArray(target)) return;
    if (target instanceof Tms) {
        fn(target, rid.join('.'));
        Object.keys(target).forEach((k) => {
            deepRecursionTms((target as any)[k], [...rid, k], fn);
        });
    }
};
export function command({
    micro,
    position,
    payloads,
    isShowError
}: Types.CommandOptions) {
    const paths = position.split('.');
    const len = paths.length - 1;
    let current = micro as any;
    for (let i = 0; i < len; i++) {
        const name = paths[i];
        if (current[name] && current[name] instanceof Tms) {
            current = current[name];
        } else if (isShowError) {
            throw new Error(`${position} 的 ${name} class 不存在`);
        }
    }
    const fnName: string = paths[paths.length - 1];
    const fn: Function = current[fnName];
    if (typeof fn === 'function') {
        return fn.call(current, ...payloads);
    } else if (isShowError) {
        throw new Error(`${position} 的 ${fnName} 方法不存在`);
    }
}

export class Micro extends MicroBase {
    public debug: boolean = process.env.NODE_ENV !== 'production';
    private subs: Types.Subscribe[] = [];
    private commits: Types.Commit[] = [];
    public constructor(options?: Types.MicroOptions) {
        super();
        Object.defineProperty(this, 'debug', {
            enumerable: false
        });
        Object.defineProperty(this, 'subs', {
            enumerable: false
        });
        Object.defineProperty(this, 'commits', {
            enumerable: false
        });
        if (options && options.commits) {
            this.commits = options.commits;
        }
    }

    public register(name: string, installModule: any) {
        const rid = super.register(name, installModule);
        deepRecursionTms(installModule, [rid], (target, path) => {
            (target.dep as any)[`_micro_observe_${rid}`] = (
                event: Types.TmsEvent
            ) => {
                const commit: Types.Commit = {
                    position: `${path}.${event.type}`,
                    payloads: event.payloads
                };
                this.subs.forEach((fn) => fn(commit));
                if (this.debug) {
                    // eslint-disable-next-line no-console
                    console.log(
                        `position   ${commit.position}(payload: ${getType(
                            event.payloads[0]
                        )});`,
                        '\n\rpayloads   ',
                        typeof event.payload === 'object'
                            ? JSON.parse(JSON.stringify(event.payloads))
                            : event.payloads
                    );
                }
            };
            log(`订阅 Tms ${path}`);
            target.dep.addSub((target.dep as any)[`_micro_observe_${rid}`]);
        });
        // 还原状态
        const { commits } = this;
        if (commits.length) {
            const re = new RegExp(`^${rid}`);
            this.commits = commits.filter((event) => {
                const isOk = re.test(event.position);
                if (isOk) {
                    this.command({
                        position: event.position.replace(/^[^.]+/, rid + '.'),
                        payloads: event.payloads
                    });
                }
                return !isOk;
            });
        }
        return rid;
    }

    public unregister(name: string, rid: string) {
        const unModule = this.getModule<any>(rid);
        super.unregister(name, rid);
        deepRecursionTms(unModule, [name], (target, path) => {
            target.dep.removeSub((target.dep as any)[`_micro_observe_${rid}`]);
            log(`取消订阅 Tms ${path}`);
            // 释放内存
            (target.dep as any)[`_micro_observe_${rid}`] = null;
        });
    }

    public subscribe(fn: Types.Subscribe) {
        this.subs.push(fn);
    }

    public unsubscribe(fn: Types.Subscribe) {
        const index = this.subs.lastIndexOf(fn);
        if (index > -1) {
            this.subs.splice(index, 1);
        }
    }

    /**
     * 只有在服务端才应该调用这个方法
     */
    public createServerCommit() {
        const commits: Types.Commit[] = [];
        this.subscribe((commit) => {
            if (/\.\$\$[^$]/.test(commit.position)) return;
            commits.push(commit);
        });
        return commits;
    }

    /**
     * 执行某个命令
     */
    public command(
        options: Omit<Types.CommandOptions, 'micro' | 'isShowError'>
    ) {
        return command({
            ...options,
            micro: this,
            isShowError: false
        });
    }
}
