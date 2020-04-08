import { Build } from '@fmfe/genesis-compiler';
import { ssr } from './genesis';

const start = () => {
    return Object.values(ssr).map((ssr) => {
        return new Build(ssr).start();
    });
};
start();
