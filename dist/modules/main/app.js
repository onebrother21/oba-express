"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
const middleware_1 = require("../middleware");
const createApp = (api) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    const middleware = middleware_1.OBAExpressMiddleware.init();
    const { common, custom, main, order } = api.config.middleware || {};
    const noMiddleware = !common && !custom;
    const mainSetter = () => __awaiter(void 0, void 0, void 0, function* () {
        main ?
            app.use(api.vars.entry, yield main(api)) :
            app.get(api.vars.entry, (req, res) => res.json({ ready: true }));
    });
    if (noMiddleware)
        yield mainSetter();
    else
        for (const k of order) {
            console.log(k);
            switch (true) {
                case k == "main": {
                    yield mainSetter();
                    break;
                }
                case oba_common_1.default.match(/custom\./, k): {
                    const name = k.split(".")[1];
                    const setter = custom ? custom[name] : null;
                    setter ? app.use(yield setter(api)) : null;
                    break;
                }
                default: {
                    const opts = common[k];
                    console.log(opts);
                    const setter = middleware[k];
                    setter && opts ? setter(app, opts, api) : null;
                    break;
                }
            }
        }
    middleware.pageNotFound(app, null, api);
    middleware.finalHandler(app, null, api);
    return app;
});
exports.createApp = createApp;
//# sourceMappingURL=app.js.map