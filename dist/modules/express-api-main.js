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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
        this.init = () => {
            const core = new oba_core_api_1.default(this.config);
            core.init();
            const { config } = core, core_ = __rest(core, ["config"]);
            Object.assign(this, core_);
            this.app = this.createRouter();
            this.server = this.app ? (0, http_1.createServer)(this.app) : null;
            const isSocketServer = this.config.sockets && this.server;
            if (isSocketServer)
                this.io = new sockets_main_1.OBAExpressApiSockets(this.config.sockets, this.server);
            //this.events.emit("config",c);
        };
        this.start = (db, server) => __awaiter(this, void 0, void 0, function* () {
            yield this.monitor();
            if (db)
                yield this.startDb();
            if (server)
                yield this.startServer();
        });
        this.startDb = () => __awaiter(this, void 0, void 0, function* () { return yield this.db.start(); });
        this.startServer = () => __awaiter(this, void 0, void 0, function* () { return new Promise(done => this.server.listen(this.vars.port, () => done())); });
    }
    createRouter() {
        const app = (0, express_1.default)();
        const middleware = new middleware_main_1.OBAExpressApiMiddleware();
        const { middleware: middlewareConfig } = this.config;
        const noMiddleware = !middlewareConfig || oba_common_1.default.empty(middlewareConfig);
        const custom = (middlewareConfig || {}).custom;
        const main = (middlewareConfig || {}).main;
        const mainSetter = () => {
            main ?
                app.use(this.vars.entry, main(this)) :
                app.get(this.vars.entry, (req, res) => res.json({ ready: true }));
        };
        const setCustomMiddleware = (k, b) => {
            if (custom)
                for (const m in custom) {
                    const handler = custom[m];
                    handler.active ?
                        handler.before == k && b ? app.use(handler.func(this)) :
                            handler.after == k && !b ? app.use(handler.func(this)) :
                                null : null;
                }
        };
        if (noMiddleware)
            mainSetter();
        else
            for (const k in middlewareConfig)
                if (k != "custom") {
                    const k1 = k;
                    const opts = middlewareConfig[k1];
                    const setter = middleware[k1];
                    setCustomMiddleware(k, 1);
                    k == "main" ? mainSetter() : setter ? setter(app, opts, this) : null;
                    setCustomMiddleware(k, 0);
                }
        middleware.pageNotFound(app, null, this);
        middleware.finalHandler(app, null, this);
        return app;
    }
    get routes() { return (0, express_list_endpoints_1.default)(this.app); }
    monitor() {
        return __awaiter(this, void 0, void 0, function* () {
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
    }
}
exports.OBAExpressApi = OBAExpressApi;
exports.default = OBAExpressApi;
//# sourceMappingURL=express-api-main.js.map