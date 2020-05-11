"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const genesis_core_1 = require("@fmfe/genesis-core");
const vue_1 = require("./vue");
const bar_1 = require("./bar");
const style_1 = require("./style");
const babel_1 = require("./babel");
const image_1 = require("./image");
const font_1 = require("./font");
const media_1 = require("./media");
const template_1 = require("./template");
class InstallPlugin extends genesis_core_1.Plugin {
    constructor(ssr) {
        super(ssr);
        ssr.plugin.use(bar_1.BarPlugin);
        ssr.plugin.use(vue_1.VuePlugin);
        ssr.plugin.use(style_1.StylePlugin);
        ssr.plugin.use(babel_1.BabelPlugin);
        ssr.plugin.use(image_1.ImagePlugin);
        ssr.plugin.use(font_1.FontPlugin);
        ssr.plugin.use(media_1.MediaPlugin);
        ssr.plugin.use(template_1.TemplatePlugin);
    }
}
exports.InstallPlugin = InstallPlugin;
