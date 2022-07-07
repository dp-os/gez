import type * as Genesis from '..';
import { type MF } from '.';

export class Base {
    public ssr: Genesis.SSR;
    public mf: MF;
    public constructor(ssr: Genesis.SSR, mf: MF) {
        this.ssr = ssr;
        this.mf = mf;
    }
}
