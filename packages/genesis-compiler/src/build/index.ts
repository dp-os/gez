import { SSR } from '@fmfe/genesis-core';
import chalk from 'chalk';
import webpack from 'webpack';

import { AnalyzerPlugin } from '../plugins/analyzer';
import { InstallPlugin } from '../plugins/install';
import { deleteFolder } from '../utils/index';
import { ClientConfig, ServerConfig } from '../webpack/index';

const error = chalk.bold.red;
const warning = chalk.keyword('orange');

export interface BuildOptions {
    analyzer?: boolean;
}

export class Build {
    public ssr: SSR;
    public constructor(ssr: SSR, options: BuildOptions = {}) {
        this.ssr = ssr;
        ssr.plugin.unshift(InstallPlugin);
        if (options.analyzer) {
            ssr.plugin.use(AnalyzerPlugin);
        }
    }

    public async start() {
        const { ssr } = this;
        const build = (type: string, config: webpack.Configuration) => {
            return new Promise<boolean>((resolve, reject) => {
                const compiler = webpack(config);
                compiler.run((err, stats) => {
                    if (err) {
                        chalk.red(`${type} errors`);
                        console.log(error(err.stack || err.message));
                        return;
                    }
                    if (!stats) return;
                    const jsonStats = stats.toJson();
                    if (stats.hasErrors()) {
                        chalk.red(`${type} errors`);
                        const errors = jsonStats.errors || [];
                        errors.forEach((err) => console.log(error(err.message)));
                        return resolve(false);
                    }
                    if (stats.hasWarnings()) {
                        chalk.yellow(`${type} warnings`);
                        const warnings = jsonStats.warnings || [];
                        warnings.forEach((err) => console.log(warning(err.message)));
                    }
                    resolve(true);
                });
            });
        };
        deleteFolder(ssr.outputDir);
        await ssr.plugin.callHook('beforeCompiler', 'build');
        const values = await Promise.all([
            build(`${ssr.name} build client`, await new ClientConfig(ssr).toConfig()),
            build(`${ssr.name} build server`, await new ServerConfig(ssr).toConfig())
        ]);
        await ssr.plugin.callHook('afterCompiler', 'build');
        if (values[0] === false || values[1] === false) {
            console.log(error(`[@fmfe/genesis-compiler] ${ssr.name} Compilation failed, please check the code error`));
            process.exitCode = 1;
        }
        return values;
    }
}
