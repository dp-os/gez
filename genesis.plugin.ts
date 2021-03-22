import { Plugin, PostcssOptions } from '@fmfe/genesis-core';
import tailwindcss from 'tailwindcss';
export class PostcssPlugin extends Plugin {
    public postcss(config: PostcssOptions) {
        config.postcssOptions.plugins.push(tailwindcss);
    }
}
