import type { ParsedModuleConfig } from '@gez/core';
import type { Compiler } from '@rspack/core';
import { entryPlugin } from './entry-plugin';
import { externalPlugin } from './external-plugin';
import { importmapPlugin } from './importmap-plugin';
import { packagePlugin } from './package-plugin';

export function moduleLinkPlugin(moduleConfig: ParsedModuleConfig) {
    return (compiler: Compiler) => {
        entryPlugin(moduleConfig, compiler);
        externalPlugin(moduleConfig, compiler);
        importmapPlugin(moduleConfig, compiler);
        packagePlugin(moduleConfig, compiler);
    };
}
