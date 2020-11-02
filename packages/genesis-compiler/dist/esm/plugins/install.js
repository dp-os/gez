import { Plugin } from '@fmfe/genesis-core';
import { VuePlugin } from './vue';
import { BarPlugin } from './bar';
import { StylePlugin } from './style';
import { BabelPlugin } from './babel';
import { ImagePlugin } from './image';
import { FontPlugin } from './font';
import { MediaPlugin } from './media';
import { TemplatePlugin } from './template';
export class InstallPlugin extends Plugin {
    constructor(ssr) {
        super(ssr);
        ssr.plugin.unshift(BarPlugin);
        ssr.plugin.unshift(VuePlugin);
        ssr.plugin.unshift(StylePlugin);
        ssr.plugin.unshift(BabelPlugin);
        ssr.plugin.unshift(ImagePlugin);
        ssr.plugin.unshift(FontPlugin);
        ssr.plugin.unshift(MediaPlugin);
        ssr.plugin.unshift(TemplatePlugin);
    }
}
