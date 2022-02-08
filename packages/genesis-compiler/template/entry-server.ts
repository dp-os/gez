// @ts-nocheck
import './webpack-public-path-server';

const promise = import('${{serverFilename}}');

export default function entryServer() {
    // eslint-disable-next-line
    return promise.then((m) => {
        return m.default.apply(this, arguments)
    });
}
