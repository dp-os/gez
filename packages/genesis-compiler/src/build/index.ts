import webpack from 'webpack';
import chalk from 'chalk';
import { SSR } from '@fmfe/genesis-core';
import { InstallPlugin } from '../plugins/install';
import { ClientConfig, ServerConfig } from '../webpack/index';
import { deleteFolder } from '../utils/index';

const error = chalk.bold.red;
const warning = chalk.keyword('orange');

export class Build {
    public ssr: SSR;
    public constructor(ssr: SSR) {
        this.ssr = ssr;
        ssr.plugin.unshift(InstallPlugin);
    }

    public async start() {
        const { ssr } = this;
        const build = (type: string, config) => {
            return new Promise<boolean>((resolve, reject) => {
                const compiler = webpack(config);
                compiler.run((err: Error, stats) => {
                    const jsonStats = stats.toJson();
                    if (err || stats.hasErrors()) {
                        chalk.red(`${type} errors`);
                        jsonStats.errors.forEach((err: Error) =>
                            console.log(error(err))
                        );
                        return resolve(false);
                    }
                    if (stats.hasWarnings()) {
                        chalk.yellow(`${type} warnings`);
                        jsonStats.warnings.forEach((err: Error) =>
                            console.log(warning(err))
                        );
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
        if (values[0] === false || values[1] === false) {
            console.log(
                error(
                    `[@fmfe/genesis-compiler] ${ssr.name} Compilation failed, please check the code error`
                )
            );
            process.exitCode = 1;
        }
        return values;
    }
}
