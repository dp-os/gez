#!/bin/bash

function run ()
{
    rm -rf ./examples/${1}/types
    cp -r tsconfig.cjs.json ./examples/${1}/tsconfig.cjs.json
    cp -r tsconfig.esm.json ./examples/${1}/tsconfig.esm.json
    lerna run --scope=${1} ${2}
}
run ssr-shared ${1}
run ssr-hub ${1}