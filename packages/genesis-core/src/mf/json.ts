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

type Callback = () => void;

export class Json<T> {
    public filename: string;
    public data: T;
    private _data: () => T;
    private subs: Callback[] = [];
    public constructor(filename: string, _data: () => T) {
        this.filename = filename;
        this._data = _data;
        this.data = this.get();
    }
    public get exists() {
        const { filename } = this;
        return fs.existsSync(filename);
    }
    public get(): T {
        if (this.exists) {
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
    public watch(cb: () => void) {
        this.subs.push(cb);
        this._updateWatch();
        return () => {
            const index = this.subs.indexOf(cb);
            if (index > -1) {
                this.subs.splice(index, 1);
            }
            this._updateWatch();
        };
    }
    private _updateWatch() {
        switch (this.subs.length) {
            case 0:
                fs.unwatchFile(this.filename, this._watch);
                break;
            case 1:
                fs.watchFile(this.filename, this._watch);
                break;
        }
    }
    private _watch = () => {
        this.get();
        this.subs.forEach((cb) => cb());
    };
}
