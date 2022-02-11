import fs from 'fs';
import relative from 'relative';
export class BaseGenesis {
    constructor(ssr) {
        this.ssr = ssr;
    }
}
export const deleteFolder = (path) => {
    if (!fs.existsSync(path))
        return;
    const files = fs.readdirSync(path);
    files.forEach(function (file) {
        const curPath = path + '/' + file;
        if (fs.statSync(curPath).isDirectory()) {
            deleteFolder(curPath);
        }
        else {
            fs.unlinkSync(curPath);
        }
    });
    fs.rmdirSync(path);
};
export function relativeFilename(from, to) {
    let path = relative(from, to);
    if (!path.startsWith('.')) {
        path = `./` + path;
    }
    return path;
}
