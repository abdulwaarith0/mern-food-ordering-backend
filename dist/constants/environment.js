"use strict";
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH0_AUDIENCE = exports.AUTH0_ISSUER_BASE_URL = exports.DB_NAME = exports.MONGODB_URI = exports.PORT = exports.NODE_ENV = void 0;
exports.NODE_ENV = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
exports.PORT = (_b = process.env.PORT) !== null && _b !== void 0 ? _b : "7000";
exports.MONGODB_URI = (_c = process.env.MONGODB_URI) !== null && _c !== void 0 ? _c : "";
exports.DB_NAME = (_d = process.env.DB_NAME) !== null && _d !== void 0 ? _d : "";
exports.AUTH0_ISSUER_BASE_URL = (_e = process.env.AUTH0_ISSUER_BASE_URL) !== null && _e !== void 0 ? _e : "";
exports.AUTH0_AUDIENCE = (_f = process.env.AUTH0_AUDIENCE) !== null && _f !== void 0 ? _f : "";