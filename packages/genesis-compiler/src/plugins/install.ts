import { Plugin, SSR } from '@fmfe/genesis-core';

import { VuePlugin } from './vue';
import { BarPlugin } from './bar';
import { StylePlugin } from './style';
import { BabelPlugin } from './babel';
import { ImagePlugin } from './image';
import { FontPlugin } from './font';
import { MediaPlugin } from './media';
import { TemplatePlugin } from './template';

export class InstallPlugin extends Plugin {
    public constructor(ssr: SSR) {
        super(ssr);
        ssr.plugin.use(BarPlugin);
        ssr.plugin.use(VuePlugin);
        ssr.plugin.use(StylePlugin);
        ssr.plugin.use(BabelPlugin);
        ssr.plugin.use(ImagePlugin);
        ssr.plugin.use(FontPlugin);
        ssr.plugin.use(MediaPlugin);
        ssr.plugin.use(TemplatePlugin);
    }
}
