"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCSS = exports.isJS = void 0;
const isJS = (file) => {
    return /\.js(\?[^.]+)?$/.test(file);
};
exports.isJS = isJS;
const isCSS = (file) => /\.css(\?[^.]+)?$/.test(file);
exports.isCSS = isCSS;
