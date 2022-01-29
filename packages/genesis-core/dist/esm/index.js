import { MF as MFConstructor } from './mf';
import { Plugin as PluginConstructor, PluginManage as PluginManageConstructor } from './plugin';
import { Renderer as RendererConstructor } from './renderer';
import { SSR as SSRConstructor } from './ssr';
// eslint-disable-next-line @typescript-eslint/no-namespace
var Genesis;
(function (Genesis) {
    /**
     * SSR Constructor
     */
    Genesis.SSR = SSRConstructor;
    Genesis.MF = MFConstructor;
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
