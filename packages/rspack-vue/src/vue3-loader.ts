import type { rspack } from '@gez/rspack';

const ADD_IMPORT = `
import { useSSRContext } from 'vue';
function initImport () {

    const mixins = Array.isArray(__exports__.mixins) ? __exports__.mixins : [];
    mixins.push({
        created () {
            const ctx = useSSRContext();
            ctx?.importMetaSet?.add(import.meta);
        }
    });
    __exports__.mixins = mixins;
}
initImport();
`;

export default function (this: rspack.LoaderContext, text: string) {
    return text + ADD_IMPORT;
}

export const vue3Loader = new URL(import.meta.resolve(import.meta.url))
    .pathname;
