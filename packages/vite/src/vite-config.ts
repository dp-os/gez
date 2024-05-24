import { type Gez } from '@gez/core';
import { type InlineConfig, mergeConfig, type PluginOption } from 'vite';

export function mergeViteConfig(gez: Gez, config: InlineConfig): InlineConfig {
    const plugins: PluginOption[] = [];
    return mergeConfig<InlineConfig, InlineConfig>(config, {
        root: gez.root,
        base: gez.base,
        plugins
    });
}
