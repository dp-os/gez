"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = exports.BaseGenesis = void 0;
const fs_1 = __importDefault(require("fs"));
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
            exports.deleteFolder(curPath);
        }
        else {
            fs_1.default.unlinkSync(curPath);
        }
    });
    fs_1.default.rmdirSync(path);
};
exports.deleteFolder = deleteFolder;
