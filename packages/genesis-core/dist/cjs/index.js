"use strict";
const ssr_1 = require("./ssr");
const plugin_1 = require("./plugin");
const renderer_1 = require("./renderer");
// eslint-disable-next-line @typescript-eslint/no-namespace
var Genesis;
(function (Genesis) {
    /**
     * SSR Constructor
     */
    Genesis.SSR = ssr_1.SSR;
    /**
     * Renderer Constructor
     */
    Genesis.Renderer = renderer_1.Renderer;
    /**
     * SSR plug-in
     */
    Genesis.Plugin = plugin_1.Plugin;
    /**
     * Plug in Management Center
     */
    Genesis.PluginManage = plugin_1.PluginManage;
})(Genesis || (Genesis = {}));
module.exports = Genesis;
