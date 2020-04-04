"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_1 = __importDefault(require("webpack"));
const chalk_1 = __importDefault(require("chalk"));
const install_1 = require("../plugins/install");
const index_1 = require("../webpack/index");
const index_2 = require("../utils/index");
class Build {
    constructor(ssr) {
        this.ssr = ssr;
        ssr.plugin.use(install_1.InstallPlugin);
    }
    async start() {
        const { ssr } = this;
        const build = (type, config) => {
            return new Promise((resolve, reject) => {
                const compiler = webpack_1.default(config);
                compiler.run((err, stats) => {
                    const jsonStats = stats.toJson();
                    if (err || stats.hasErrors()) {
                        chalk_1.default.red(`${type} errors`);
                        jsonStats.errors.forEach((err) => console.error(err));
                        return resolve(false);
                    }
                    if (stats.hasWarnings()) {
                        chalk_1.default.yellow(`${type} warnings`);
                        jsonStats.warnings.forEach((err) => console.warn(err));
                    }
                    resolve(true);
                });
            });
        };
        index_2.deleteFolder(ssr.outputDir);
        await ssr.plugin.callHook('beforeCompiler', 'build');
        const values = await Promise.all([
            build(`${ssr.name} build client`, await new index_1.ClientConfig(ssr).toConfig()),
            build(`${ssr.name} build server`, await new index_1.ServerConfig(ssr).toConfig())
        ]);
        await ssr.plugin.callHook('afterCompiler', 'build');
        return values;
    }
}
exports.Build = Build;
