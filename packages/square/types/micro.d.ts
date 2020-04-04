import Vue from 'vue';
import { Types } from './types';
export declare const log: (log: string) => void;
declare class MicroBase {
    static install: any;
    private static _Vue;
    static setVue(_Vue: typeof Vue): void;
    static getVue(): typeof Vue;
    private vm;
    private rid;
    private useCount;
    constructor();
    addUse(): void;
    reduceUse(): void;
    get isUse(): boolean;
    /**
     * Registration module
     */
    register(name: string, v: any): Types.Rid;
    /**
     * Get module
     */
    getModule<T>(rid: Types.Rid): T;
    /**
     * Remove module
     */
    unregister(name: string, rid: Types.Rid): void;
    /**
     * Destroy instance
     */
    destroy(): void;
}
export declare function command({ micro, position, payloads, isShowError }: Types.CommandOptions): any;
export declare class Micro extends MicroBase {
    debug: boolean;
    private subs;
    private commits;
    constructor(options?: Types.MicroOptions);
    register(name: string, installModule: any): string;
    unregister(name: string, rid: string): void;
    subscribe(fn: Types.Subscribe): void;
    unsubscribe(fn: Types.Subscribe): void;
    /**
     * 只有在服务端才应该调用这个方法
     */
    createServerCommit(): Types.Commit[];
    /**
     * 执行某个命令
     */
    command(options: Omit<Types.CommandOptions, 'micro' | 'isShowError'>): any;
}
export {};
