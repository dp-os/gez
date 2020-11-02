import { SSR as SSRConstructor } from './ssr';
import { Plugin as PluginConstructor, PluginManage as PluginManageConstructor } from './plugin';
import { Renderer as RendererConstructor } from './renderer';
// eslint-disable-next-line @typescript-eslint/no-namespace
var Genesis;
(function (Genesis) {
    /**
     * SSR Constructor
     */
    Genesis.SSR = SSRConstructor;
    /**
     * Renderer Constructor
     */
    Genesis.Renderer = RendererConstructor;
    /**
     * SSR plug-in
     */
    Genesis.Plugin = PluginConstructor;
    /**
     * Plug in Management Center
     */
    Genesis.PluginManage = PluginManageConstructor;
})(Genesis || (Genesis = {}));
