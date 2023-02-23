#!/bin/bash
yarn build:packages
lerna publish --registry=https://registry.npmjs.org --force-publish --exact