import { type Gez } from '@gez/core';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { type RspackOptions } from '@rspack/core';

import { createNodeConfig } from './node';

export function createServerConfig(gez: Gez) {
    const base = createNodeConfig(gez, 'server');

    return {
        ...base
    } satisfies RspackOptions;
}
