[![Build Status](https://travis-ci.org/fmfe/genesis.svg?branch=master)](https://travis-ci.org/fmfe/genesis)
[![Coverage Status](https://coveralls.io/repos/github/fmfe/genesis/badge.svg?branch=master)](https://coveralls.io/github/fmfe/genesis?branch=master)
[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) 
[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)
[![npm](https://img.shields.io/npm/dt/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)

[![Architecture diagram](https://fmfe.github.io/genesis-docs/renderer.jpg?v=1)](https://fmfe.github.io/genesis-docs/guide/renderer.html)

## What is Genesis?
- It is only a render Library Based on Vue SSR. It provides four render modes: `ssr-html`, `ssr-json`, `csr-html` and `csr-json`.    
- `HTML` render mode, can improve the first screen render speed and more SEO friendly.
- `JSON` render mode can be provided to `Vue`、 `EJS`、`React`, etc. for server-side render or client-side render.
- Microservices provide API interfaces through the `JSON` render mode. Whether it is a micro front end or a microservice, other services can render the results.

## Quick start
```bash
yarn
yarn dev # development
yarn build # Build production package
yarn start # Run production package
# open http://localhost:3000
```

## Document
[简体中文](https://fmfe.github.io/genesis-docs/guide/)| [English](https://anish2690.github.io/genesis-docs-en/)


## Codesandbox
- [vue-genesis-template](https://codesandbox.io/s/condescending-architecture-ifgpt) One of the most basic and simple examples

## Demo
- [vue-genesis-template](https://github.com/fmfe/vue-genesis-template) Create SSR project from zero
- [genesis-router-demo](https://github.com/fmfe/genesis-router-demo) The demo of Vue router is used
- [vue-genesis-micro](https://github.com/fmfe/vue-genesis-micro) Demo for microservice aggregation
- [vue2-demo](https://github.com/lzxb/vue2-demo) The demo of vuex and Vue router is used

## Core library description
|Library|Version|Downloads|Explain|
|:-|:-:|:-|:-|
|[genesis-core](https://fmfe.github.io/genesis-docs/core/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-core.svg)](https://www.npmjs.com/package/@fmfe/genesis-core)|It provides basic plug-in mechanism, SSR rendering logic and program configuration|
|[genesis-compiler](https://fmfe.github.io/genesis-docs/compiler/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-compiler.svg)](https://www.npmjs.com/package/@fmfe/genesis-compiler)|It is only used in the development environment. It is responsible for compiling the program and compiling at the time of development, handling the core logic of webpack|
|[genesis-app](https://fmfe.github.io/genesis-docs/app/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-app.svg)](https://www.npmjs.com/package/@fmfe/genesis-app)|Quickly create applications and wrap `vue-router`|
|[genesis-remote](https://fmfe.github.io/genesis-docs/remote/)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-remote.svg)](https://www.npmjs.com/package/@fmfe/genesis-remote)|Remote components to realize the core dependency of microservices|
|[square](https://www.npmjs.com/package/@fmfe/square)|[![npm](https://img.shields.io/npm/v/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square) |[![npm](https://img.shields.io/npm/dm/@fmfe/square.svg)](https://www.npmjs.com/package/@fmfe/square)|A state management library designed for micro modules|
|[genesis-lint](https://www.npmjs.com/package/@fmfe/genesis-lint)|[![npm](https://img.shields.io/npm/v/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint) |[![npm](https://img.shields.io/npm/dm/@fmfe/genesis-lint.svg)](https://www.npmjs.com/package/@fmfe/genesis-lint)|A code specification integration, including eslint and stylelint| 

## Which companies use it
- [FOLLOWME5.0](https://www.followme.com/)
