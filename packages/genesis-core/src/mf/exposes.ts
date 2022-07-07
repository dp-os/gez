import type * as Genesis from '..';
import { type MF } from './index';
import { createManifest, Json, ManifestJson } from './json';

type ExposesWatchCallback = () => void;

export class Exposes {
    public ssr: Genesis.SSR;
    private subs: ExposesWatchCallback[] = [];
    private manifestJson: Json<ManifestJson>;
    public constructor(ssr: Genesis.SSR, mf: MF) {
        this.ssr = ssr;
        this.manifestJson = new Json(mf.outputManifest, createManifest);
    }
    public get manifest() {
        return this.manifestJson.data;
    }
    public watch(cb: ExposesWatchCallback) {
        const wrap = () => {
            return cb();
        };
        this.subs.push(wrap);
        return () => {
            const index = this.subs.indexOf(wrap);
            if (index > -1) {
                this.subs.splice(index, 1);
            }
        };
    }
    public getManifest(t = 0, maxAwait = 1000 * 60): Promise<ManifestJson> {
        if (!t || t !== this.manifest.t) {
            return Promise.resolve({ ...this.manifest });
        }
        return new Promise<ManifestJson>((resolve) => {
            const timer = setTimeout(() => {
                resolve({ ...this.manifest });
            }, maxAwait);
            this.watch(() => {
                clearTimeout(timer);
                resolve({ ...this.manifest });
            });
        });
    }
    public emit() {
        this.manifestJson.get();
        this.subs.forEach((cb) => cb());
    }
}
