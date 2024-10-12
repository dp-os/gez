import fs from 'node:fs';
import path from 'node:path';

fs.symlinkSync(
    path.resolve(
        import.meta.dirname,
        './examples/ssr-rspack-vue2_remote/dist/server'
    ),
    path.resolve(
        import.meta.dirname,
        './examples/ssr-rspack-vue2_remote/node_modules/ssr-rspack-vue2_remote'
    )
);
