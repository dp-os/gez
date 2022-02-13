#!/bin/bash

function build ()
{
    echo "build ${1}"
    rm -rf ./node_modules/@fmfe/${1}/types
    rm -rf ./node_modules/@fmfe/${1}/dist
    rm -rf ./packages/${1}/dist
    rm -rf ./packages/${1}/types
    rm -rf ./packages/${1}/tsconfig.json
    cp -r tsconfig.cjs.json ./packages/${1}/tsconfig.cjs.json
    cp -r tsconfig.esm.json ./packages/${1}/tsconfig.esm.json

    # NODE_ENV=production tsc --build packages/${1}/tsconfig.cjs.json
    # NODE_ENV=production tsc --build packages/${1}/tsconfig.esm.json
    lerna run --scope=@fmfe/${1} build
    # cp -r ./packages/${1}/dist node_modules/@fmfe/${1}/dist
    # cp -r ./packages/${1}/types node_modules/@fmfe/${1}/types
}

build genesis-core
build genesis-compiler
build genesis-app
build square
