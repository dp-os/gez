import { Build } from '@fmfe/genesis-compiler';

import { ssr } from './genesis';
import { PostcssPlugin } from './genesis.plugin';

ssr.layout.plugin.use(PostcssPlugin);

const start = () => {
    return Object.values(ssr).map((ssr) => {
        return new Build(ssr).start();
    });
};
start();
