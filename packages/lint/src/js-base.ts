export default {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint-config-love',
    'plugin:import/errors',
    'plugin:import/typescript',
    'plugin:prettier/recommended'
  ],
  plugins: ['simple-import-sort'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'no-lone-blocks': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    'no-template-curly-in-string': 'off',
    '@typescript-eslint/no-extraneous-class': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'no-return-await': 'error',
    '@typescript-eslint/promise-function-async': 'off',
    '@typescript-eslint/return-await': 'off',
    '@typescript-eslint/class-literal-property-style': 'off',
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
  files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
  settings: {
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        extensions: ['.js', 'jsx', '.vue', '.ts', 'tsx']
      },
      typescript: {
        alwaysTryTypes: true
      }
    }
  }
}
