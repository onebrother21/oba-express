"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.OBAExpressApi = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const util_1 = __importDefault(require("util"));
const dns_1 = __importDefault(require("dns"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const oba_common_1 = __importStar(require("@onebro/oba-common"));
const oba_core_api_1 = __importDefault(require("@onebro/oba-core-api"));
const middleware_main_1 = require("./middleware-main");
const sockets_main_1 = require("./sockets-main");
class OBAExpressApi extends oba_common_1.Component {
    constructor() {
        super(...arguments);
        this.startServer = () => __awaiter(this, void 0, void 0, function* () {
            const PORT = this.vars.port;
            const HOST = this.vars.host;
            const serverOK = () => {
                const started = new Date();
                const info = oba_common_1.default.stringify(Object.assign(Object.assign({}, this.vars), { started }));
                oba_common_1.default.ok("Server started now man", this.server.address());
                this.logger.postLogMsg("info", info);
            };
            const serverErr = (e) => {
                if (e.code === "EADDRINUSE") {
                    oba_common_1.default.log("Address in use, retrying...");
                    setTimeout(() => {
                        this.server.close();
                        this.server.listen(PORT);
                    }, 1000);
                }
            };
            this.server.on("listening", serverOK);
            this.server.on("error", serverErr);
            this.server.listen(PORT);
        });
        this.createApp = () => __awaiter(this, void 0, void 0, function* () {
            const api = this;
            const app = (0, express_1.default)();
            const middleware = middleware_main_1.OBAExpressApiMiddleware.init();
            const { middleware: middlewareConfig } = this.config;
            const noMiddleware = !middlewareConfig || oba_common_1.default.empty(middlewareConfig);
            const custom = middlewareConfig === null || middlewareConfig === void 0 ? void 0 : middlewareConfig.custom;
            const main = middlewareConfig === null || middlewareConfig === void 0 ? void 0 : middlewareConfig.main;
            const mainSetter = () => __awaiter(this, void 0, void 0, function* () {
                main ?
                    app.use(this.vars.entry, yield main(api)) :
                    app.get(this.vars.entry, (req, res) => res.json({ ready: true }));
            });
            const setCustomMiddleware = (k, b) => __awaiter(this, void 0, void 0, function* () {
                if (custom)
                    for (const m in custom) {
                        const handler = custom[m];
                        handler.active ?
                            handler.before == k && b ? app.use(yield handler.func(api)) :
                                handler.after == k && !b ? app.use(yield handler.func(api)) :
                                    null : null;
                    }
            });
            if (noMiddleware)
                yield mainSetter();
            else
                for (const k in middlewareConfig)
                    if (k != "custom") {
                        const k1 = k;
                        const opts = middlewareConfig[k1];
                        const setter = middleware[k1];
                        yield setCustomMiddleware(k, 1);
                        k == "main" ? yield mainSetter() : setter ? setter(app, opts, api) : null;
                        yield setCustomMiddleware(k, 0);
                    }
            middleware.pageNotFound(app, null, api);
            middleware.finalHandler(app, null, api);
            return app;
        });
        this.initCore = (start) => __awaiter(this, void 0, void 0, function* () {
            const core = new oba_core_api_1.default(this.config);
            yield core.init(start);
            delete core.config;
            Object.assign(this, core);
        });
        this.initServer = (start) => __awaiter(this, void 0, void 0, function* () {
            this.app = yield this.createApp();
            this.server = this.app ? (0, http_1.createServer)(this.app) : null;
            const isSocketServer = this.config.sockets && this.server;
            const checkConn = this.server && this.vars.settings && this.vars.settings.checkConn;
            if (isSocketServer)
                this.io = sockets_main_1.OBAExpressApiSockets.init(this.config.sockets, this.server);
            if (checkConn)
                yield this.monitor();
            if (start)
                this.startServer();
        });
        this.monitor = () => __awaiter(this, void 0, void 0, function* () {
            const check = this.vars.settings.checkConn;
            if (check) {
                let live = true;
                const source = (0, rxjs_1.interval)(1000 * (oba_common_1.default.bool(check) ? 10 : check));
                const loop = source.pipe((0, operators_1.takeWhile)(() => live), (0, operators_1.tap)(() => __awaiter(this, void 0, void 0, function* () {
                    const isConnected = util_1.default.promisify(dns_1.default.lookupService);
                    const connected = yield isConnected("8.8.8.8", 53);
                    oba_common_1.default.ok("Network Connection OK");
                })), (0, operators_1.catchError)((e) => (0, rxjs_1.of)((e) => {
                    //events.emit("error",errCtrl.map(e)); <- MISIMPLEMENTATION
                    oba_common_1.default.warn("No Network Connection");
                    live = false;
                })));
                return loop.subscribe();
            }
        });
        this.init = (db, server) => __awaiter(this, void 0, void 0, function* () {
            yield this.initCore(db);
            yield this.initServer(server);
        });
    }
    get e() { return this.errors; }
    get v() { return this.vars; }
    set v(vars) { this.vars = vars; }
    get routes() { return (0, express_list_endpoints_1.default)(this.app); }
}
exports.OBAExpressApi = OBAExpressApi;
exports.default = OBAExpressApi;
//# sourceMappingURL=express-api-main.js.map