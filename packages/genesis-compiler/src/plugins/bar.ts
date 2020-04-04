import WebpackBar from 'webpackbar';
import { Plugin, WebpackHookParams } from '@fmfe/genesis-core';
export class BarPlugin extends Plugin {
    public webpackConfig({ target, config }: WebpackHookParams) {
        const options =
            target === 'client'
                ? {
                      name: `Client: ${this.ssr.name}`,
                      color: 'green'
                  }
                : {
                      name: `Server: ${this.ssr.name}`,
                      color: 'orange'
                  };
        config.plugin('webpackbar').use(WebpackBar, [options]);
    }
}
