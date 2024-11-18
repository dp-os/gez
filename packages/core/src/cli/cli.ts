import { COMMAND, Gez } from '../gez';

export async function cli(command: string) {
    if (command !== COMMAND.dev) {
        process.env.NODE_ENV = 'production';
    }
    let gez: Gez | null;
    switch (command) {
        case COMMAND.dev:
            gez = new Gez(await Gez.getSrcOptions());
            exit(await gez.init(COMMAND.start));
            gez = null;
            break;
        case COMMAND.start:
            gez = new Gez(await Gez.getDistOptions());
            exit(await gez.init(COMMAND.start));
            gez = null;
            break;
        case COMMAND.build:
            // 编译代码。
            gez = new Gez(await Gez.getSrcOptions());
            exit(await gez.init(COMMAND.build));
            exit(await gez.destroy());

            // 生产模式运行
            gez = new Gez({
                ...(await Gez.getDistOptions()),
                createServer: undefined
            });
            exit(await gez.init(COMMAND.start));
            exit(await gez.postCompileProdHook());
            break;
        case COMMAND.preview:
            // 编译代码
            gez = new Gez(await Gez.getSrcOptions());
            exit(await gez.init(COMMAND.build));
            exit(await gez.destroy());

            // 生产模式运行
            gez = new Gez(await Gez.getDistOptions());
            exit(await gez.init(COMMAND.start));
            exit(await gez.postCompileProdHook());

            break;
    }
}

function exit(ok: boolean) {
    if (!ok) {
        process.exit(17);
    }
}
