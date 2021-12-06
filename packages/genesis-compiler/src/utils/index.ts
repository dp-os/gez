import Genesis from '@fmfe/genesis-core';
import fs from 'fs';

export class BaseGenesis {
    public ssr: Genesis.SSR;
    public constructor(ssr: Genesis.SSR) {
        this.ssr = ssr;
    }
}

export const deleteFolder = (path: string) => {
    if (!fs.existsSync(path)) return;
    const files = fs.readdirSync(path);
    files.forEach(function (file) {
        const curPath = path + '/' + file;
        if (fs.statSync(curPath).isDirectory()) {
            deleteFolder(curPath);
        } else {
            fs.unlinkSync(curPath);
        }
    });
    fs.rmdirSync(path);
};
