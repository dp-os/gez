import base from './js-base'

export default {
  ...base,
  parser: 'vue-eslint-parser',
  parserOptions: {
    ...base.parserOptions,
    extraFileExtensions: ['.vue'],
    parser: {
      ts: '@typescript-eslint/parser',
      js: '@typescript-eslint/parser',
      '<template>': 'espree'
    }
  },
  extends: ['plugin:vue/recommended', ...base.extends],
  rules: {
    ...base.rules,
    'vue/require-component-is': 'off',
    'vue/no-lone-template': 'off',
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
    'vue/valid-template-root': 'off',
    'vue/no-duplicate-attributes': [
      'error',
      {
        allowCoexistClass: true,
        allowCoexistStyle: true
      }
    ],
    'vue/attribute-hyphenation': ['error', 'never'],
    'vue/no-v-html': 'off',
    'vue/valid-define-props': 'off',
    'vue/valid-define-emits': 'off',
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/consistent-indexed-object-style': 'off'
  }
}
