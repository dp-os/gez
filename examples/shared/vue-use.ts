import { ClientOptions, RenderContext } from '@fmfe/genesis-core';
import ElementUI from 'element-ui';
import Vue from 'vue';
import VueMeta from 'vue-meta';

Vue.use(ElementUI).use(VueMeta);

export function onVueCreated(app: Vue, context: RenderContext | ClientOptions) {
    if (context.env === 'server') {
        context.beforeRender(() => {
            const { title, link, style, script, meta, htmlAttrs } = app
                .$meta()
                .inject();
            context.data.title += title?.text() || '';
            context.data.meta += meta?.text() || '';
            context.data.style += link?.text() || '';
            context.data.style += style?.text() || '';
            context.data.script += script?.text() || '';
            context.data.htmlAttr = ' ' + htmlAttrs?.text() || '';
        });
    }
}
