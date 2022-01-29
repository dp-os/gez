import type * as Genesis from '.';

export class Mf {
    public ssr: Genesis.SSR;
    public constructor (ssr: Genesis.SSR) {
        this.ssr = ssr;
    }
    public getExposes(version: string) {}
    public getRemote() {}
}