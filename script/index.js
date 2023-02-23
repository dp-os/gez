#!/usr/bin/env zx
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
const fs = require('fs');
const path = require('path');

const baseDir = path.resolve();
const scriptDir = path.resolve('script');

const examplesNames = ['ssr-demo', 'ssr-mf-about', 'ssr-mf-home'];
const packagesNames = ['genesis-core', 'genesis-compiler', 'genesis-app', 'square'];

function getProjectList(target, names) {
    return names
        .map((dir) => {
            const filename = path.resolve(baseDir, target, dir, './package.json');
            return {
                name: dir,
                packagePath: filename,
                packageJson: readJson(filename)
            };
        })
        .filter((item) => {
            return !!item.packageJson;
        });
}

function readJson(filename) {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'));
    } catch (e) {
        return null;
    }
}
function writeJson(filename, json) {
    const text = JSON.stringify(json, null, 4);
    fs.writeFileSync(filename, text + '\n', { encoding: 'utf-8' });
}

function lerna(name, command) {
    return `FORCE_COLOR=1 lerna run --scope=${name} ${command} --stream`;
}

async function runCommandList(list, command) {
    const arr = [...list];
    const item = arr.shift();
    if (!item) {
        return;
    }
    const name = item.packageJson.name;
    await $([lerna(name, command)]);
    return runCommandList(arr, command);
}

class Examples {
    constructor() {
        this.list = getProjectList('examples', examplesNames);
    }
    init() {
        return Promise.all(
            this.list.map(async (item) => {
                await $`cp -r ./script/example.tsconfig.json ./examples/${item.name}/tsconfig.json`;
                await $`cp -r ./script/example.tsconfig.node.json ./examples/${item.name}/tsconfig.node.json`;
                const targetJson = item.packageJson;
                const configJson = readJson(path.resolve(scriptDir, 'example.package.json'));
                targetJson.scripts = configJson.scripts;
                Object.assign(targetJson.scripts, configJson.scripts);
                writeJson(item.packagePath, targetJson);
            })
        );
    }
    async dev() {
        const arr = this.list.map((item) => {
            const name = item.packageJson.name;
            return `"${lerna(name, 'dev')}"`;
        });
        const text = 'concurrently --raw ' + arr.join(' ');
        return $([text]);
    }
    build() {
        return runCommandList(this.list, 'build');
    }
    typeCheck() {
        return runCommandList(this.list, 'type-check');
    }
    async start() {
        const arr = this.list.map((item) => {
            const name = item.packageJson.name;
            return `"${lerna(name, 'start')}"`;
        });
        const text = 'concurrently ' + arr.join(' ');
        return $([text]);
    }
}

class Packages {
    constructor() {
        this.list = getProjectList('packages', packagesNames);
    }
    init() {
        return Promise.all(
            this.list.map(async (item) => {
                await $`cp -r ./script/packages.tsconfig.cjs.json ./packages/${item.name}/tsconfig.cjs.json`;
                await $`cp -r ./script/packages.tsconfig.esm.json ./packages/${item.name}/tsconfig.esm.json`;
                const targetJson = item.packageJson;
                const configJson = readJson(path.resolve(scriptDir, 'packages.package.json'));
                targetJson.scripts = configJson.scripts;
                Object.assign(targetJson.scripts, configJson.scripts);
                writeJson(item.packagePath, targetJson);
            })
        );
    }
    build() {
        return runCommandList(this.list, 'build');
    }
}

async function main() {
    if (argv.examples) {
        const examples = new Examples();
        await examples.init();
        switch (argv.examples) {
            case 'dev':
                return examples.dev();
            case 'build':
                return examples.build();
            case 'start':
                return examples.start();
            case 'type-check':
                return examples.typeCheck();
        }
    } else if (argv.packages) {
        const packages = new Packages();
        await packages.init();
        switch (argv.packages) {
            case 'build':
                return packages.build();
        }
    }
}

main();
