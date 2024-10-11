import type { ServerContext, ServerRender } from './server-context';

export interface ServerOptions {
    render: (context: ServerContext) => Promise<void>;
}

export function defineServer(options: ServerOptions): ServerRender {
    return async (context) => {
        await options.render(context);
        if (context.gez.isProd) {
            const css = context
                .getPreloadCssFiles()
                .map((file) => {
                    return `<link rel="stylesheet" href="${file}">`;
                })
                .join('');
            const script = context
                .getPreloadJsFiles()
                .map((file) => {
                    return `<script type="module" src="${file}" defer></script>`;
                })
                .join('');
            context
                .insertHtml(css, 'headBefore')
                .insertHtml(script, 'bodyBefore');
        }
    };
}
