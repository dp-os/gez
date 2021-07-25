import Genesis, { SSR } from '@fmfe/genesis-core';
import { ServiceOptions } from '../../types';

/**
 * CustomSSR
 */
export default class CustomSSR extends SSR {
    /**
     * create CustomSSR instance by options
     * @param options
     */
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

    /**
     * @override
     * @param options Genesis.Options
     * @param _entryClientFile client entry file
     * @param _entryServerFile server entry file
     */
    public constructor(
        options: Genesis.Options = {},
        private _entryClientFile: string,
        private _entryServerFile: string
    ) {
        super(options)

    }
}
