import path from 'path';

import type * as Genesis from '..';
import { SSR } from '../ssr';
import { ENTRY_DIR_NAME, MANIFEST_JSON_NAME } from './config';
import { Exposes } from './exposes';
import { MFPlugin } from './plugin';
import { RemoteGroup } from './remote';

const mf = Symbol('mf');

export class MF {
    public static is(ssr: Genesis.SSR) {
        return ssr[mf] instanceof MF;
    }
    public static get(ssr: Genesis.SSR): MF {
        if (!this.is(ssr)) {
            throw new TypeError(`SSR instance: MF instance not found`);
        }
        return ssr[mf];
    }
    public options: Required<Genesis.MFOptions> = {
        remotes: [],
        intervalTime: 1000,
        exposes: {},
        shared: {},
        typesDir: ''
    };
    public exposes: Exposes;
    public remote: RemoteGroup;
    public entryName = 'exposes';
    protected ssr: Genesis.SSR;
    protected mfPlugin: MFPlugin;
    public constructor(ssr: Genesis.SSR, options: Genesis.MFOptions = {}) {
        this.ssr = ssr;
        Object.assign(this.options, options);
        ssr[mf] = this;
        this.mfPlugin = new MFPlugin(ssr, this);
        this.exposes = new Exposes(ssr, this);
        this.remote = new RemoteGroup(ssr, this);
        ssr.plugin.use(this.mfPlugin);
        if (ssr.options?.build?.extractCSS !== false) {
            throw new TypeError(
                `To use MF plug-in, build.extractCSS needs to be set to false`
            );
        }
    }
    public get haveExposes() {
        return Object.keys(this.options.exposes).length > 0;
    }
    public get varName() {
        return SSR.fixVarName(this.ssr.name);
    }
    public get output() {
        return path.resolve(this.ssr.outputDirInClient, ENTRY_DIR_NAME);
    }
    public get outputManifest() {
        return path.resolve(this.output, MANIFEST_JSON_NAME);
    }
    public get manifestRoutePath() {
        return `${this.ssr.publicPath}${ENTRY_DIR_NAME}/${MANIFEST_JSON_NAME}`;
    }
    public getWebpackPublicPathVarName(name: string) {
        return `__webpack_public_path_${SSR.fixVarName(name)}_${
            this.entryName
        }`;
    }
}
