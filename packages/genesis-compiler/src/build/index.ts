import webpack from 'webpack';
import chalk from 'chalk';
import { SSR } from '@fmfe/genesis-core';
import { InstallPlugin } from '../plugins/install';
import { ClientConfig, ServerConfig } from '../webpack/index';
import { deleteFolder } from '../utils/index';

export class Build {
    public ssr: SSR;
    public constructor(ssr: SSR) {
        this.ssr = ssr;
        ssr.plugin.use(InstallPlugin);
    }

    public async start() {
        const { ssr } = this;
        const build = (type: string, config) => {
            return new Promise<boolean>((resolve, reject) => {
                const compiler = webpack(config);
                compiler.run((err, stats) => {
                    const jsonStats = stats.toJson();
                    if (err || stats.hasErrors()) {
                        chalk.red(`${type} errors`);
                        jsonStats.errors.forEach((err) => console.error(err));
                        return resolve(false);
                    }
                    if (stats.hasWarnings()) {
                        chalk.yellow(`${type} warnings`);
                        jsonStats.warnings.forEach((err) => console.warn(err));
                    }
                    resolve(true);
                });
            });
        };
        deleteFolder(ssr.outputDir);
        await ssr.plugin.callHook('beforeCompiler', 'build');
        const values = await Promise.all([
            build(
                `${ssr.name} build client`,
                await new ClientConfig(ssr).toConfig()
            ),
            build(
                `${ssr.name} build server`,
                await new ServerConfig(ssr).toConfig()
            )
        ]);
        await ssr.plugin.callHook('afterCompiler', 'build');
        return values;
    }
}
