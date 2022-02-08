// @ts-nocheck
import './webpack-public-path-server';


export default function entryServer() {
    // eslint-disable-next-line
    const promise = import('${{serverFilename}}');
    return promise.then((m) => {
        return m.default.apply(this, arguments)
    });
}
