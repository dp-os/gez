#!/usr/bin/env node

if (!__dirname.includes('node_modules')) {
    try {
        require('@fmfe/genesis-compiler/bin/ts-node');
    } catch (e) {}
}
