// @ts-ignore
import packageJson from '../package.json';
import { serve } from './bin/serve';
import { build } from './bin/build';
import { start } from './bin/start';

export default {
    version: packageJson.version,
    serve,
    start,
    build
}
