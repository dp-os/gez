// @ts-nocheck
import './webpack-public-path-server';

export default function entryServer() {
    // eslint-disable-next-line
    return import('${{serverFilename}}').then((m) =>
        m.default.apply(this, arguments)
    );
}
