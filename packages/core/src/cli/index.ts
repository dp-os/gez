#!/usr/bin/env node --experimental-vm-modules --experimental-import-meta-resolve --experimental-strip-types

import { cli } from './cli';

cli(process.argv.slice(2)[0] || '');
