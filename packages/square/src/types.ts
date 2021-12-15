import Tms from '@fmfe/tms.js';
import Vue from 'vue';

import { Micro } from './micro';
import { Square } from './square';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Types {
    export type Rid = string;
    export type Subscribe = (commit: Commit) => void;
    export interface SubscribeEvent {
        type: string;
        payload: any;
        payloads: any[];
        target: Tms;
    }
    export interface TmsEvent {
        payload: any;
        payloads: any[];
        target: Tms;
        type: string;
    }
    export interface Commit {
        position: string;
        payloads: any[];
    }

    export interface MicroOptions {
        commits?: Commit[];
    }
    export interface CommandOptions {
        micro: Micro;
        position: string;
        payloads: any[];
        isShowError: boolean;
    }
    export declare type RegisterTypes = keyof Square;
    export declare type RegisterOptions = {
        [P in RegisterTypes]: (square: Square) => Square[P];
    };
    export type PartialSquare = Partial<RegisterOptions>;
}

declare module 'vue/types/vue' {
    interface Vue {
        $micro: Micro;
        $square: Square;
    }
}

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        micro?: Micro;
        square?: Partial<Square>;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        register?: Partial<Types.RegisterOptions>;
    }
}
