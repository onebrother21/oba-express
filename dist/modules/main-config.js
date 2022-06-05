"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressConfig = void 0;
const config_1 = __importDefault(require("config"));
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
const oba_core_1 = require("@onebro/oba-core");
const setDefaultConfigWithEnvironment = () => {
    const host = process.env.HOST || oba_common_1.default.appvar("_HOST");
    const port = Number(process.env.PORT || oba_common_1.default.appvar("_PORT"));
    const origins = oba_common_1.default.appvar("_ORIGINS");
    const providers = oba_common_1.default.appvar("_PROVIDERS");
    const consumers = oba_common_1.default.appvar("_CONSUMERS");
    const settings = { checkConn: false };
    const initial = config_1.default.get("appconfig");
    const coreRuntime = oba_common_1.default.mergeObj(initial, (0, oba_core_1.coreConfig)(), false);
    const atRuntime = {
        vars: { host, port, providers, consumers, settings },
        middleware: { common: { cors: { origins }, cors_ext: { origins } } },
    };
    const expressConfig = oba_common_1.default.mergeObj(coreRuntime, atRuntime, false);
    return expressConfig;
};
exports.expressConfig = setDefaultConfigWithEnvironment;
//# sourceMappingURL=main-config.js.map