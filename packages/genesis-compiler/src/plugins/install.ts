import { Plugin, SSR } from '@fmfe/genesis-core';

import { VuePlugin } from './vue';
import { BarPlugin } from './bar';
import { StylePlugin } from './style';
import { BabelPlugin } from './babel';
import { ImagePlugin } from './image';
import { TemplacePlugin } from './templace';

export class InstallPlugin extends Plugin {
    public constructor(ssr: SSR) {
        super(ssr);
        ssr.plugin.use(BarPlugin);
        ssr.plugin.use(VuePlugin);
        ssr.plugin.use(StylePlugin);
        ssr.plugin.use(BabelPlugin);
        ssr.plugin.use(ImagePlugin);
        ssr.plugin.use(TemplacePlugin);
    }
}
