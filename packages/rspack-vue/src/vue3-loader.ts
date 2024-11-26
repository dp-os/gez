import type { rspack } from '@gez/rspack';

export default function (this: rspack.LoaderContext, text: string) {
    // TODO
    return text;
}

export const vue3Loader = import.meta.resolve(import.meta.url);
