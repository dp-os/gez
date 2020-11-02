"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const app_vue_1 = __importDefault(require("./app.vue"));
exports.default = async (clientOptions) => {
    return new vue_1.default({
        clientOptions,
        render(h) {
            return h(app_vue_1.default);
        }
    });
};
