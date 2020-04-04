import Tms from '@fmfe/tms.js';
import Vue from 'vue';
import { Micro } from './micro';
import { Square } from './square';
export declare namespace Types {
    type Rid = string;
    type Subscribe = (commit: Commit) => void;
    interface SubscribeEvent {
        type: string;
        payload: any;
        payloads: any[];
        target: Tms;
    }
    interface TmsEvent {
        payload: any;
        payloads: any[];
        target: Tms;
        type: string;
    }
    interface Commit {
        position: string;
        payloads: any[];
    }
    interface MicroOptions {
        commits?: Commit[];
    }
    interface CommandOptions {
        micro: Micro;
        position: string;
        payloads: any[];
        isShowError: boolean;
    }
    type RegisterTypes = keyof Square;
    type RegisterOptions = {
        [P in RegisterTypes]: (square: Square) => Square[P];
    };
    type PartialSquare = Partial<RegisterOptions>;
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
        square?: Square;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        register?: Partial<Types.RegisterOptions>;
    }
}
