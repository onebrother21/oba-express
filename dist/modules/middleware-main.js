"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBAExpressApiMiddleware = void 0;
const middleware_setters_1 = require("./middleware-setters");
class OBAExpressApiMiddleware {
    constructor() { Object.assign(this, (0, middleware_setters_1.getMiddlewares)()); }
}
exports.OBAExpressApiMiddleware = OBAExpressApiMiddleware;
exports.default = OBAExpressApiMiddleware;
//# sourceMappingURL=middleware-main.js.map