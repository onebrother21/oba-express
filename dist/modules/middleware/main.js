"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBAExpressMiddleware = void 0;
const common_middleware_1 = __importDefault(require("./common-middleware"));
class OBAExpressMiddleware {
}
exports.OBAExpressMiddleware = OBAExpressMiddleware;
OBAExpressMiddleware.init = () => common_middleware_1.default;
exports.default = OBAExpressMiddleware;
//# sourceMappingURL=main.js.map