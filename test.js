import fs from 'node:fs';
import path from 'node:path';

const targetDir = path.resolve(
    import.meta.dirname,
    './examples/ssr-rspack-vue2_remote/dist/server'
);

const linkDir = path.resolve(
    import.meta.dirname,
    './examples/ssr-rspack-vue2_remote/node_modules/ssr-rspack-vue2_remote'
);

if (fs.existsSync(linkDir)) {
    fs.unlinkSync(linkDir);
}

fs.symlinkSync(targetDir, linkDir, 'dir');
