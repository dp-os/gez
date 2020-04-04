import Vue from 'vue';
import { Types } from './types';
export declare const R_NAME = "_MicroRegisterSquare";
export declare const forEachSquare: (square: Partial<Types.RegisterOptions>, cb: (square: Partial<Types.RegisterOptions>, name: string) => void) => void;
export interface RegisterItem {
    rid: Types.Rid;
    name: string;
}
export declare const microRegister: {
    beforeCreate(this: Vue): void;
    destroyed(this: Vue): void;
};
