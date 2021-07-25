#!/usr/bin/env ts-node
import { command, parse, version } from 'commander';
import cli from '../index'

version(`@genesis/cli ${cli.version}`);

command('serve')
    .description('run genesis serve')
    .allowUnknownOption()
    .action(cli.serve)

command('build')
    .description('run genesis build to build project')
    .allowUnknownOption()
    .action(cli.build)

command('start')
    .description('run genesis start to start production env')
    .allowUnknownOption()
    .action(cli.start)

parse();
