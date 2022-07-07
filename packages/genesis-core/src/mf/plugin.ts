import type * as Genesis from '..';
import { Plugin } from '../plugin';
import { type MF } from './index';

export class MFPlugin extends Plugin {
    public mf: MF;
    public constructor(ssr: Genesis.SSR, mf: MF) {
        super(ssr);
        this.mf = mf;
    }
    public renderBefore(context: Genesis.RenderContext): void {
        context.data.script += this.mf.remote.inject();
    }
}
