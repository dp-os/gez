import Genesis, { SSR } from '@fmfe/genesis-core';
import { ServiceOptions } from '../../types';

export default class CustomSSR extends SSR {
    static createInstanceByServiceOptions(options: ServiceOptions) {

        return new CustomSSR({
            name: options.name,
            build: options.build
        }, String(options.entryClient), String(options.entryServer));
    }

    public get entryServerFile(): string {
        return this._entryServerFile;
    }
    public set entryServerFile(value: string) {
        this._entryServerFile = value;
    }

    public get entryClientFile(): string {
        return this._entryClientFile;
    }

    public set entryClientFile(value: string) {
        this._entryClientFile = value;
    }

    public noWebpackGenTemplate = true;

    public constructor(
        options: Genesis.Options = {},
        private _entryClientFile: string,
        private _entryServerFile: string
    ) {
        super(options)

    }
}
