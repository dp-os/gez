#!/bin/bash

function build ()
{
    echo "build ${1}"
    rm -rf ./examples/${1}/types
    cp -r tsconfig.cjs.json ./examples/${1}/tsconfig.cjs.json
    cp -r tsconfig.esm.json ./examples/${1}/tsconfig.esm.json
    lerna run --scope=${1} build:dts
}

build ssr-shared
build ssr-hub