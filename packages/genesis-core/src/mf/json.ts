import fs from 'fs';
import write from 'write';

import type * as Genesis from '..';

export type ManifestJson = Genesis.MFManifestJson;

export function createManifest(): ManifestJson {
    return {
        c: '',
        s: '',
        t: 0,
        d: 0
    };
}

export class Json<T> {
    public filename: string;
    public data: T;
    private _data: () => T;
    public constructor(filename: string, _data: () => T) {
        this.filename = filename;
        this._data = _data;
        this.data = this.get();
    }
    public get haveCache() {
        const { filename } = this;
        return fs.existsSync(filename);
    }
    public get(): T {
        if (this.haveCache) {
            const text = fs.readFileSync(this.filename, { encoding: 'utf-8' });
            this.data = JSON.parse(text);
        } else {
            this.data = this._data();
        }
        return this.data;
    }
    public set(data: T) {
        this.data = data;
        const text = JSON.stringify(data, null, 4);
        write.sync(this.filename, text);
    }
}
