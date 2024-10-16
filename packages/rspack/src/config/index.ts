import type { Gez } from '@gez/core';
import type { RspackOptions } from '@rspack/core';

import type { BuildTarget, CreateConfig } from './base';
import { createBaseConfig } from './base-config';
export { type BuildTarget, type CreateConfig } from './base';

export interface DefineConfigOptions {
    gez: Gez;
    buildTarget: BuildTarget;
    config: RspackOptions;
}

export function defineConfig(
    cb: (options: DefineConfigOptions) => RspackOptions
): CreateConfig {
    return (gez: Gez, buildTarget: BuildTarget) => {
        return cb({
            gez,
            buildTarget,
            config: createBaseConfig(gez, buildTarget)
        });
    };
}
