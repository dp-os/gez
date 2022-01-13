import './webpack-public-path-server';

const entry = require('${{serverFilename}}').default;

export default function (context: any) {
    Object.assign(global, context._global);
    return entry(context);
}
