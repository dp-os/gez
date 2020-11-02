"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Square = exports.Micro = exports.Tms = void 0;
const micro_1 = require("./micro");
Object.defineProperty(exports, "Micro", { enumerable: true, get: function () { return micro_1.Micro; } });
const square_1 = require("./square");
Object.defineProperty(exports, "Square", { enumerable: true, get: function () { return square_1.Square; } });
const tms_js_1 = __importDefault(require("@fmfe/tms.js"));
exports.Tms = tms_js_1.default;
