import type * as Genesis from '..';
import { type MF } from './index';
import { createManifest, Json, ManifestJson } from './json';

export class Exposes {
    public ssr: Genesis.SSR;
    private manifestJson: Json<ManifestJson>;
    public constructor(ssr: Genesis.SSR, mf: MF) {
        this.ssr = ssr;
        this.manifestJson = new Json(mf.outputManifest, createManifest);
    }
    public get manifest() {
        return this.manifestJson.data;
    }
    public getManifest(t = 0, maxAwait = 1000 * 60): Promise<ManifestJson> {
        if (!t || t !== this.manifest.t) {
            return Promise.resolve({ ...this.manifest });
        }
        return new Promise<ManifestJson>((resolve) => {
            const timer = setTimeout(done, maxAwait);
            const unWatch = this.manifestJson.watch(done);
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this;
            function done() {
                clearTimeout(timer);
                unWatch();
                resolve({ ...self.manifest });
            }
        });
    }
    public _update() {
        this.manifestJson.get();
    }
}
