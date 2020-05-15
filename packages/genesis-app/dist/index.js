"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.createServerApp = exports.createClientApp = void 0;
const create_app_1 = require("./create-app");
Object.defineProperty(exports, "createClientApp", { enumerable: true, get: function () { return create_app_1.createClientApp; } });
Object.defineProperty(exports, "createServerApp", { enumerable: true, get: function () { return create_app_1.createServerApp; } });
const router_1 = require("./router");
Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return router_1.Router; } });
