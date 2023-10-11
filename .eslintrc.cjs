module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: "standard-with-typescript",
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./examples/*/tsconfig.json", "./packages/*/tsconfig.json"],
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/await-thenable': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off'
  },
};
