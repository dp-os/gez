const path = require('path');
const fs = require('fs');

const alias = {};
const filePath = path.resolve(__dirname, '../../../package.json');
if (fs.existsSync(filePath)) {
    alias[require(filePath).name] = path.resolve(__dirname, '../../../');
}

module.exports = {
    extends: [
        'standard',
        'alloy/typescript',
        'alloy/vue',
        'plugin:import/errors',
        'plugin:import/typescript',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/babel',
        'prettier/standard',
        'prettier/unicorn',
        'prettier/vue',
        'plugin:prettier/recommended'
    ],
    plugins: ['@typescript-eslint', 'vue'],
    parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    globals: {},
    rules: {
        'no-param-reassign': 'off',
        'max-params': ['error', 5],
        'vue/component-tags-order': [
            'error',
            {
                order: ['template', 'script', 'style']
            }
        ],
        'vue/require-component-is': 'off',
        'vue/component-definition-name-casing': ['error', 'kebab-case'],
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        'no-template-curly-in-string': 'off',
        'vue/valid-template-root': 'off',
        camelcase: 'off',
        'prettier/prettier': [
            'error',
            {
                tabWidth: 4,
                useTabs: false,
                semi: true,
                singleQuote: true,
                bracketSpacing: true,
                arrowParens: 'always'
            }
        ]
    },
    settings: {
        'import/resolver': {
            'eslint-import-resolver-custom-alias': {
                alias,
                extensions: ['.js', 'jsx', '.vue', '.ts', 'tsx']
            },
            typescript: {
                alwaysTryTypes: true
            }
        }
    }
};
