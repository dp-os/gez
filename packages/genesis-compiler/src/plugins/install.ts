import { MF, Plugin, SSR } from '@fmfe/genesis-core';

import { BabelPlugin } from './babel';
import { BarPlugin } from './bar';
import { DefinePlugin } from './define';
import { FontPlugin } from './font';
import { ImagePlugin } from './image';
import { MediaPlugin } from './media';
import { MFPlugin } from './mf';
import { ModuleReplacePlugin } from './module-replace';
import { StylePlugin } from './style';
import { TemplatePlugin } from './template';
import { VuePlugin } from './vue';
import { WorkerPlugin } from './worker';

export class InstallPlugin extends Plugin {
    public constructor(ssr: SSR) {
        super(ssr);
        ssr.plugin
            .unshift(BarPlugin)
            .unshift(VuePlugin)
            .unshift(StylePlugin)
            .unshift(BabelPlugin)
            .unshift(ImagePlugin)
            .unshift(FontPlugin)
            .unshift(MediaPlugin)
            .unshift(TemplatePlugin)
            .unshift(WorkerPlugin)
            .unshift(DefinePlugin)
            .unshift(ModuleReplacePlugin);
        if (MF.is(ssr)) {
            ssr.plugin.unshift(MFPlugin);
        }
    }
}
