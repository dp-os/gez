import module from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { COMMAND, Gez, type GezOptions } from '../gez';

export async function cli(command: string) {
    if (command !== COMMAND.dev) {
        process.env.NODE_ENV = 'production';
    }
    let gez: Gez | null;
    let opts: GezOptions | null = null;
    switch (command) {
        case COMMAND.dev:
            opts = await Gez.getSrcOptions();
            gez = new Gez(opts);
            exit(await gez.init(COMMAND.dev));

            // 释放内存
            gez = null;
            opts = null;
            break;
        case COMMAND.start:
            opts = await Gez.getDistOptions();
            gez = new Gez(opts);
            exit(await gez.init(COMMAND.start));

            // 释放内存
            gez = null;
            opts = null;
            break;
        case COMMAND.build:
            // 编译代码。
            opts = await Gez.getSrcOptions();
            gez = new Gez(opts);
            exit(await gez.init(COMMAND.build));
            exit(await gez.destroy());

            if (typeof opts.postCompileProdHook === 'function') {
                // 生产模式运行
                gez = new Gez({
                    ...opts,
                    createServer: undefined
                });
                exit(await gez.init(COMMAND.start));
                exit(await gez.postCompileProdHook());
            }

            // 释放内存
            gez = null;
            opts = null;
            break;
        case COMMAND.preview:
            opts = await Gez.getSrcOptions();
            // 编译代码
            gez = new Gez(opts);
            exit(await gez.init(COMMAND.build));
            exit(await gez.destroy());

            // 生产模式运行
            gez = new Gez(opts);
            exit(await gez.init(COMMAND.start));
            exit(await gez.postCompileProdHook());

            // 释放内存
            gez = null;
            opts = null;
            break;
        default:
            await import(path.resolve(process.cwd(), command));
            break;
    }
}

function exit(ok: boolean) {
    if (!ok) {
        process.exit(17);
    }
}

// 支持 TS 文件不需要编写 .ts 后缀。
module.register(fileURLToPath(import.meta.url), {
    parentURL: import.meta.url
});

export function resolve(
    specifier: string,
    context: Record<string, any>,
    nextResolve: Function
) {
    if (
        context?.parentURL.endsWith('.ts') &&
        specifier.startsWith('.') &&
        !specifier.endsWith('.ts')
    ) {
        return nextResolve(specifier + '.ts', context);
    }
    return nextResolve(specifier, context);
}
