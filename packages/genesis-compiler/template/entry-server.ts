import './webpack-public-path-server';


export default function entryServer () {
    return import('${{serverFilename}}').then(m => m.default.apply(this, arguments));
}