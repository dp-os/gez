"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Build = void 0;
const chalk_1 = __importDefault(require("chalk"));
const webpack_1 = __importDefault(require("webpack"));
const analyzer_1 = require("../plugins/analyzer");
const install_1 = require("../plugins/install");
const index_1 = require("../utils/index");
const index_2 = require("../webpack/index");
const error = chalk_1.default.bold.red;
const warning = chalk_1.default.keyword('orange');
class Build {
    constructor(ssr, options = {}) {
        this.ssr = ssr;
        ssr.plugin.unshift(install_1.InstallPlugin);
        if (options.analyzer) {
            ssr.plugin.use(analyzer_1.AnalyzerPlugin);
        }
    }
    async start() {
        const { ssr } = this;
        const build = (type, config) => {
            return new Promise((resolve, reject) => {
                const compiler = (0, webpack_1.default)(config);
                compiler.run((err, stats) => {
                    if (err) {
                        chalk_1.default.red(`${type} errors`);
                        console.log(error(err.stack || err.message));
                        return;
                    }
                    const jsonStats = stats.toJson();
                    if (stats.hasErrors()) {
                        chalk_1.default.red(`${type} errors`);
                        jsonStats.errors.forEach((err) => console.log(error(err.message)));
                        return resolve(false);
                    }
                    if (stats.hasWarnings()) {
                        chalk_1.default.yellow(`${type} warnings`);
                        jsonStats.warnings.forEach((err) => console.log(warning(err.message)));
                    }
                    resolve(true);
                });
            });
        };
        (0, index_1.deleteFolder)(ssr.outputDir);
        await ssr.plugin.callHook('beforeCompiler', 'build');
        const values = await Promise.all([
            build(`${ssr.name} build client`, await new index_2.ClientConfig(ssr).toConfig()),
            build(`${ssr.name} build server`, await new index_2.ServerConfig(ssr).toConfig())
        ]);
        await ssr.plugin.callHook('afterCompiler', 'build');
        if (values[0] === false || values[1] === false) {
            console.log(error(`[@fmfe/genesis-compiler] ${ssr.name} Compilation failed, please check the code error`));
            process.exitCode = 1;
        }
        return values;
    }
}
exports.Build = Build;
