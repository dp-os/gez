import fs from 'fs';

import type * as Genesis from '..';
import { type Remote } from './remote';
import { createRequest } from './request';

type ManifestJson = Genesis.MFManifestJson;

export interface RemoteFetchOptions {
    getJson: (context: { filename: string; t: number; remote: Remote }) => Promise<ManifestJson | null>;
    getZip: (context: { filename: string; remote: Remote }) => Promise<Uint8Array | null>;
}

export class HttpFetch implements RemoteFetchOptions {
    private request = createRequest();
    public async getJson(context: { filename: string; t: number; remote: Remote }) {
        const url = `${context.filename}?t=${context.t}&n=${Date.now()}`;
        return this.request
            .get(url, context.remote.requestConfig)
            .then((res) => res.data)
            .catch(() => null);
    }
    public async getZip(context: { filename: string; remote: Remote }) {
        return this.request
            .get(context.filename, {
                ...context.remote.requestConfig,
                responseType: 'arraybuffer'
            })
            .then((res) => res.data)
            .catch(() => null);
    }
}

export class FileFetch implements RemoteFetchOptions {
    public async getJson(context: { filename: string; t: number; remote: Remote }) {
        if (fs.existsSync(context.filename)) {
            return new Promise<ManifestJson | null>((resolve) => {
                fs.readFile(context.filename, { encoding: 'utf-8' }, (err, text) => {
                    let data: ManifestJson | null = null;
                    if (!err) {
                        try {
                            data = JSON.parse(text) as ManifestJson;
                        } catch (err) {
                            console.error(err);
                        }
                    } else {
                        console.error(err);
                    }
                    resolve(data);
                });
            });
        }
        return null;
    }
    public async getZip(context: { filename: string; remote: Remote }) {
        if (fs.existsSync(context.filename)) {
            return new Promise<Uint8Array | null>((resolve) => {
                fs.readFile(context.filename, {}, (err, data) => {
                    if (err) {
                        return resolve(null);
                    }
                    return new Uint8Array(data);
                });
            });
        }
        return null;
    }
}

export class NullFetch implements RemoteFetchOptions {
    public async getJson() {
        return null;
    }
    public async getZip() {
        return null;
    }
}
