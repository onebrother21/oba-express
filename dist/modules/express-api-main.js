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
exports.OBAExpressApi = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const util_1 = __importDefault(require("util"));
const dns_1 = __importDefault(require("dns"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
const oba_core_api_1 = __importDefault(require("@onebro/oba-core-api"));
const middleware_main_1 = require("./middleware-main");
const sockets_main_1 = require("./sockets-main");
class OBAExpressApi {
    constructor(config) {
        this.config = config;
        this.startDB = () => __awaiter(this, void 0, void 0, function* () { return yield this.db.start(); });
        this.startServer = () => __awaiter(this, void 0, void 0, function* () { return new Promise(done => this.server.listen(this.vars.port, () => done())); });
        this.createApp = () => __awaiter(this, void 0, void 0, function* () {
            const app = (0, express_1.default)();
            const middleware = new middleware_main_1.OBAExpressApiMiddleware();
            const { middleware: middlewareConfig } = this.config;
            const noMiddleware = !middlewareConfig || oba_common_1.default.empty(middlewareConfig);
            const custom = (middlewareConfig || {}).custom;
            const main = (middlewareConfig || {}).main;
            const mainSetter = () => __awaiter(this, void 0, void 0, function* () {
                main ?
                    app.use(this.vars.entry, yield main(this)) :
                    app.get(this.vars.entry, (req, res) => res.json({ ready: true }));
            });
            const setCustomMiddleware = (k, b) => __awaiter(this, void 0, void 0, function* () {
                if (custom)
                    for (const m in custom) {
                        const handler = custom[m];
                        handler.active ?
                            handler.before == k && b ? app.use(yield handler.func(this)) :
                                handler.after == k && !b ? app.use(yield handler.func(this)) :
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
                        k == "main" ? yield mainSetter() : setter ? setter(app, opts, this) : null;
                        yield setCustomMiddleware(k, 0);
                    }
            middleware.pageNotFound(app, null, this);
            middleware.finalHandler(app, null, this);
            return app;
        });
        this.initCore = (start) => __awaiter(this, void 0, void 0, function* () {
            const core = new oba_core_api_1.default(this.config);
            core.init();
            delete core.config;
            Object.assign(this, core);
            if (start)
                yield this.startDB();
        });
        this.initServer = (start) => __awaiter(this, void 0, void 0, function* () {
            this.app = yield this.createApp();
            this.server = this.app ? (0, http_1.createServer)(this.app) : null;
            const isSocketServer = this.config.sockets && this.server;
            const checkConn = this.server && this.vars.settings && this.vars.settings.checkConn;
            if (isSocketServer)
                this.io = new sockets_main_1.OBAExpressApiSockets(this.config.sockets, this.server);
            if (checkConn)
                yield this.monitor();
            if (start)
                yield this.startServer();
        });
        this.monitor = () => __awaiter(this, void 0, void 0, function* () {
            const check = this.vars.settings.checkConn;
            const errCtrl = this.e;
            const events = this.events;
            if (check) {
                let live = true;
                const source = (0, rxjs_1.interval)(1000 * (oba_common_1.default.bool(check) ? 10 : check));
                const loop = source.pipe((0, operators_1.takeWhile)(() => live), (0, operators_1.tap)(() => __awaiter(this, void 0, void 0, function* () {
                    const isConnected = util_1.default.promisify(dns_1.default.lookupService);
                    const connected = yield isConnected("8.8.8.8", 53);
                    oba_common_1.default.ok("Network Connection OK");
                })), (0, operators_1.catchError)((e) => (0, rxjs_1.of)((e) => {
                    //events.emit("error",errCtrl.map(e));
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
    get routes() { return (0, express_list_endpoints_1.default)(this.app); }
}
exports.OBAExpressApi = OBAExpressApi;
exports.default = OBAExpressApi;
//# sourceMappingURL=express-api-main.js.map