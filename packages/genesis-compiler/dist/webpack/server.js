"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const base_1 = require("./base");
class ServerConfig extends base_1.BaseConfig {
    constructor(ssr) {
        super(ssr, 'server');
        this.config
            .entry('app')
            .add(this.ssr.entryServerFile)
            .end();
        this.config.output
            .path(this.ssr.outputDirInServer)
            .filename(this.ssr.isProd
            ? 'js/[name].[contenthash:8].js'
            : 'js/[name].js');
        this.config.target('node');
        this.config.devtool('source-map');
        this.config.output.libraryTarget('commonjs2');
        this.config.externals(webpack_node_externals_1.default({
            whitelist: [
                /\.css$/,
                /\.less$/,
                /\?vue&type=style/,
                /core-js/,
                /@babel\/runtime/,
                /regenerator-runtime/,
                ...this.ssr.transpile
            ]
        }));
        this.config.optimization.minimize(false);
    }
}
exports.ServerConfig = ServerConfig;
