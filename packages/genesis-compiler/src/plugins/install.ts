import { Plugin, SSR, MF } from '@fmfe/genesis-core';

import { BabelPlugin } from './babel';
import { BarPlugin } from './bar';
import { FontPlugin } from './font';
import { ImagePlugin } from './image';
import { MediaPlugin } from './media';
import { MFPlugin } from './mf';
import { StylePlugin } from './style';
import { TemplatePlugin } from './template';
import { VuePlugin } from './vue';
import { WorkerPlugin } from './worker';

export class InstallPlugin extends Plugin {
    public constructor(ssr: SSR) {
        super(ssr);
        ssr.plugin.unshift(BarPlugin);
        ssr.plugin.unshift(VuePlugin);
        ssr.plugin.unshift(StylePlugin);
        ssr.plugin.unshift(BabelPlugin);
        ssr.plugin.unshift(ImagePlugin);
        ssr.plugin.unshift(FontPlugin);
        ssr.plugin.unshift(MediaPlugin);
        ssr.plugin.unshift(TemplatePlugin);
        ssr.plugin.unshift(WorkerPlugin);
        if (MF.is(ssr)) {
            ssr.plugin.unshift(MFPlugin);
        }
    }
}
