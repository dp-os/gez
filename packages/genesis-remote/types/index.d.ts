import Vue from 'vue';
export interface RemoteViewData {
    automount: boolean;
    html: string;
    id: string;
    name: string;
    style: string;
    script: string;
    url: string;
    state: {
        [x: string]: any;
    };
}
/**
 * 加载样式文件
 */
export declare const loadStyle: (html: string) => Promise<boolean[]>;
/**
 * 加载js文件
 */
export declare const loadScript: (html: string) => Promise<boolean[]>;
/**
 * 远程调用组件
 */
export declare const RemoteView: any;
declare const _default: {
    install(_Vue: typeof Vue): void;
};
export default _default;
