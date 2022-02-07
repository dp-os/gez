import Genesis from '@fmfe/genesis-core';

export const shared: Genesis.SharedObject = {
    vue: {
        singleton: true
    },
    'vue-router': {
        singleton: true
    },
    'element-ui': {
        singleton: true
    }
};
