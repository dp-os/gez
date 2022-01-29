"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefinePlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const webpack_1 = __importDefault(require("webpack"));
class DefinePlugin extends genesis_core_1.Plugin {
    chainWebpack({ target, config }) {
        const { ssr } = this;
        config.plugin('define').use(webpack_1.default.DefinePlugin, [
            {
                'process.env.VUE_ENV': JSON.stringify(target),
                'process.env.GENESIS_NAME': JSON.stringify(ssr.name),
                'process.env.PUBLIC_PATH_VAR_NAME': JSON.stringify(ssr.publicPathVarName)
            }
        ]);
    }
}
exports.DefinePlugin = DefinePlugin;
