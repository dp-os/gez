import { ClientOptions, RenderContext } from '@fmfe/genesis-core';
import ElementUI from 'element-ui';
import Vue from 'vue';
import VueMeta from 'vue-meta';

Vue.use(ElementUI).use(VueMeta);

export function onVueCreated(app: Vue, context: RenderContext | ClientOptions) {
    if (context.env === 'server') {
        context.beforeRender(() => {
            const { title, link, style, script, meta } = app.$meta().inject();
            appendText(context.data, 'title', title?.text() ?? '');
            appendText(context.data, 'meta', meta?.text() ?? '');
            appendText(context.data, 'style', style?.text() ?? '');
            appendText(context.data, 'style', link?.text() ?? '');
            appendText(context.data, 'script', script?.text() ?? '');
            // .... 可以根据自己的需求往模板中注入变量，在 ./index.html 即可使用
        });
    }
}

function appendText(data: Record<string, string>, key: string, value: string) {
    if (typeof data[key] !== 'string') {
        data[key] = '';
    }
    if (value) {
        data[key] += value;
    }
}
