import type { Gez } from '@gez/core';

export type BuildTarget = 'node' | 'client' | 'server';

export abstract class BuildConfig<T> {
    protected gez: Gez;
    protected buildTarget: BuildTarget;
    constructor(gez: Gez, buildTarget: BuildTarget) {
        this.gez = gez;
        this.buildTarget = buildTarget;
    }

    public get(): T {
        switch (this.buildTarget) {
            case 'node':
                return this.getNode();
            case 'client':
                return this.getClient();
            case 'server':
                return this.getServer();
        }
    }
    protected abstract getNode(): T;
    protected abstract getClient(): T;
    protected abstract getServer(): T;
}
