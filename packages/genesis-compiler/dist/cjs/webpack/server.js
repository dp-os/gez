"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerConfig = void 0;
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
const base_1 = require("./base");
class ServerConfig extends base_1.BaseConfig {
    constructor(ssr) {
        super(ssr, 'server');
        this.config.entry('app').add(this.ssr.entryServerFile).end();
        this.config.output
            .path(this.ssr.outputDirInServer)
            .filename('[name].js');
        this.config.target('node');
        this.config.devtool(false);
        this.config.output.libraryTarget('commonjs2');
        this.config.externals((0, webpack_node_externals_1.default)({
            allowlist: [
                /\.css$/,
                /\.less$/,
                /\?vue&type=style/,
                /core-js/,
                /@babel\/runtime/,
                /regenerator-runtime/,
                ...this.ssr.transpile
            ]
        }));
        this.config.module.set('parser', {
            javascript: {
                url: 'relative'
            }
        });
        this.config.optimization.minimize(false);
    }
}
exports.ServerConfig = ServerConfig;
