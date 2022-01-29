"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallPlugin = void 0;
const genesis_core_1 = require("@fmfe/genesis-core");
const babel_1 = require("./babel");
const bar_1 = require("./bar");
const font_1 = require("./font");
const image_1 = require("./image");
const media_1 = require("./media");
const mf_1 = require("./mf");
const style_1 = require("./style");
const template_1 = require("./template");
const vue_1 = require("./vue");
const worker_1 = require("./worker");
const define_1 = require("./define");
class InstallPlugin extends genesis_core_1.Plugin {
    constructor(ssr) {
        super(ssr);
        ssr.plugin.unshift(bar_1.BarPlugin);
        ssr.plugin.unshift(vue_1.VuePlugin);
        ssr.plugin.unshift(style_1.StylePlugin);
        ssr.plugin.unshift(babel_1.BabelPlugin);
        ssr.plugin.unshift(image_1.ImagePlugin);
        ssr.plugin.unshift(font_1.FontPlugin);
        ssr.plugin.unshift(media_1.MediaPlugin);
        ssr.plugin.unshift(template_1.TemplatePlugin);
        ssr.plugin.unshift(worker_1.WorkerPlugin);
        ssr.plugin.unshift(define_1.DefinePlugin);
        if (genesis_core_1.MF.is(ssr)) {
            ssr.plugin.unshift(mf_1.MFPlugin);
        }
    }
}
exports.InstallPlugin = InstallPlugin;
