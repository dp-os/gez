#!/usr/bin/env sh

rm -rf node_modules
yarn 
yarn build:ts
yarn build
yarn test
npm run semantic-release
lerna publish  --registry=https://registry.npmjs.org --force-publish