#!/usr/bin/env node
const pwd = process.env.PWD || '';
if (!pwd.includes('node_modules')) {
    try {
        require('@fmfe/genesis-compiler/bin/ts-node');
    } catch (e) {}
}
