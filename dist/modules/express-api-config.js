"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressConfig = void 0;
const config_1 = __importDefault(require("config"));
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
const oba_core_api_1 = require("@onebro/oba-core-api");
const setDefaultConfigWithEnvironment = (prefix) => {
    const host = oba_common_1.default.evar(prefix, "_HOST");
    const port = Number(oba_common_1.default.evar(prefix, "_PORT"));
    const origins = oba_common_1.default.evar(prefix, "_ORIGINS") ? oba_common_1.default.evar(prefix, "_ORIGINS").split(",") : [];
    const providers = JSON.parse(oba_common_1.default.evar(prefix, "_PROVIDERS"));
    const consumers = JSON.parse(oba_common_1.default.evar(prefix, "_CONSUMERS"));
    const settings = { checkConn: false };
    const initial = config_1.default.get("appconfig");
    const coreRuntime = oba_common_1.default.mergeObj(initial, (0, oba_core_api_1.coreConfig)(prefix));
    const atRuntime = {
        vars: { host, port, providers, consumers, settings },
        middleware: { cors: { origins } },
    };
    const expressConfig = oba_common_1.default.mergeObj(coreRuntime, atRuntime);
    return expressConfig;
};
exports.expressConfig = setDefaultConfigWithEnvironment;
//# sourceMappingURL=express-api-config.js.map