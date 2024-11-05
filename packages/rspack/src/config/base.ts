import type { BuildTarget, Gez } from '@gez/core';

export abstract class BuildConfig<T> {
    protected gez: Gez;
    protected target: BuildTarget;
    constructor(gez: Gez, buildTarget: BuildTarget) {
        this.gez = gez;
        this.target = buildTarget;
    }

    public get(): T {
        switch (this.target) {
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
