"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relativeFilename = exports.deleteFolder = exports.BaseGenesis = void 0;
const fs_1 = __importDefault(require("fs"));
const relative_1 = __importDefault(require("relative"));
class BaseGenesis {
    constructor(ssr) {
        this.ssr = ssr;
    }
}
exports.BaseGenesis = BaseGenesis;
const deleteFolder = (path) => {
    if (!fs_1.default.existsSync(path))
        return;
    const files = fs_1.default.readdirSync(path);
    files.forEach(function (file) {
        const curPath = path + '/' + file;
        if (fs_1.default.statSync(curPath).isDirectory()) {
            (0, exports.deleteFolder)(curPath);
        }
        else {
            fs_1.default.unlinkSync(curPath);
        }
    });
    fs_1.default.rmdirSync(path);
};
exports.deleteFolder = deleteFolder;
function relativeFilename(from, to) {
    let path = (0, relative_1.default)(from, to);
    if (!path.startsWith('.')) {
        path = `./` + path;
    }
    return path;
}
exports.relativeFilename = relativeFilename;
