import type * as Genesis from '..';
import { Base } from './base';

type Callback = () => void;

export class RemoteController extends Base {
    private subs: Callback[] = [];
    public watch(cb: Callback) {
        this.subs.push(cb);
        return () => {
            const index = this.subs.indexOf(cb);
            if (index > -1) {
                this.subs.splice(index, 1);
            }
        };
    }
    public async onFetch(t: number): Promise<Genesis.ClientManifest | null> {
        return null;
    }
    public async onDownload(filename: string): Promise<Uint8Array | null> {
        return null;
    }
    public destroy() {
        this.subs = [];
    }
}
