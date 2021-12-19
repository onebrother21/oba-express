"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBAExpressApiMiddleware = void 0;
const middleware_setters_1 = require("./middleware-setters");
class OBAExpressApiMiddleware {
}
exports.OBAExpressApiMiddleware = OBAExpressApiMiddleware;
OBAExpressApiMiddleware.init = () => (0, middleware_setters_1.getCommonMiddlewares)();
exports.default = OBAExpressApiMiddleware;
//# sourceMappingURL=middleware-main.js.map