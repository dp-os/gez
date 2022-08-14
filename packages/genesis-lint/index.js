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
        'plugin:prettier/recommended'
    ],
    plugins: ['vue', 'simple-import-sort'],
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
        'simple-import-sort/imports': 'error',
        'no-param-reassign': 'off',
        'max-params': ['error', 5],
        'no-undef': 'off',
        'vue/component-tags-order': [
            'error',
            {
                order: ['script', 'template', 'style']
            }
        ],
        'vue/html-self-closing': [
            'error',
            {
                html: {
                    void: 'always',
                    normal: 'always',
                    component: 'always'
                },
                svg: 'always',
                math: 'always'
            }
        ],
        'vue/require-component-is': 'off',
        'vue/component-definition-name-casing': ['error', 'kebab-case'],
        '@typescript-eslint/prefer-optional-chain': 'off',
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-invalid-this': 'off',
        '@typescript-eslint/no-loss-of-precision': 'off',
        '@typescript-eslint/member-ordering': 'off',
        'no-template-curly-in-string': 'off',
        'vue/valid-template-root': 'off',
        'vue/no-duplicate-attributes': [
            'error',
            {
                allowCoexistClass: true,
                allowCoexistStyle: true
            }
        ],
        camelcase: 'off',
        'prettier/prettier': [
            'error',
            {
                tabWidth: 4,
                useTabs: false,
                semi: true,
                trailingComma: 'none',
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
