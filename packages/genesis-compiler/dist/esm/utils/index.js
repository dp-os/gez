import fs from 'fs';
export class BaseGenesis {
    ssr;
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
