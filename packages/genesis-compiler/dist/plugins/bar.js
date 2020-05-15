"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarPlugin = void 0;
const webpackbar_1 = __importDefault(require("webpackbar"));
const genesis_core_1 = require("@fmfe/genesis-core");
class BarPlugin extends genesis_core_1.Plugin {
    chainWebpack({ target, config }) {
        const options = target === 'client'
            ? {
                name: `Client: ${this.ssr.name}`,
                color: 'green'
            }
            : {
                name: `Server: ${this.ssr.name}`,
                color: 'orange'
            };
        config.plugin('webpackbar').use(webpackbar_1.default, [options]);
    }
}
exports.BarPlugin = BarPlugin;
