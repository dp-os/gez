import base from './js-base';

export default {
    ...base,
    parser: 'vue-eslint-parser',
    parserOptions: {
        ...base.parserOptions,
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser'
    },
    extends: ['plugin:vue/recommended', ...base.extends]
};
