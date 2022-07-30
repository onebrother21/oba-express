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
exports.OBAExpress = void 0;
const express_list_endpoints_1 = __importDefault(require("express-list-endpoints"));
const util_1 = __importDefault(require("util"));
const dns_1 = __importDefault(require("dns"));
const http_1 = require("http");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const oba_common_1 = __importStar(require("@onebro/oba-common"));
const oba_core_1 = __importDefault(require("@onebro/oba-core"));
const app_1 = require("./app");
const sockets_1 = require("../sockets");
class OBAExpress extends oba_common_1.Component {
    constructor() {
        super(...arguments);
        this.startServer = () => __awaiter(this, void 0, void 0, function* () {
            const PORT = this.vars.port;
            const HOST = this.vars.host;
            const serverOK = () => {
                const started = new Date();
                const { address, port } = this.server.address() || {};
                const server = { host: HOST, address, port, started };
                oba_common_1.default.ok(`Api Server Started --> ${this.vars.name}`);
                this.logger.postLogMsg("info", oba_common_1.default.stringify({ server }));
            };
            const serverErr = (e) => {
                if (e.code === "EADDRINUSE") {
                    oba_common_1.default.log("Address in use, retrying (2)...");
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
        this.createApp = app_1.createApp;
        this.init = (db, server) => __awaiter(this, void 0, void 0, function* () {
            yield this.initCore(db);
            yield this.initServer(server);
        });
        this.initCore = (start) => __awaiter(this, void 0, void 0, function* () {
            const core = new oba_core_1.default(this.config);
            yield core.init(start);
            delete core.config;
            Object.assign(this, core);
        });
        this.initServer = (start) => __awaiter(this, void 0, void 0, function* () {
            this.app = yield this.createApp(this);
            this.server = this.app ? (0, http_1.createServer)(this.app) : null;
            const isSocketServer = this.config.sockets && this.server;
            const checkConn = this.server && this.vars.settings && this.vars.settings.checkConn;
            if (isSocketServer)
                this.io = sockets_1.OBAExpressSockets.init(this.config.sockets, this.server);
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
    }
    get e() { return this.errors; }
    get v() { return this.vars; }
    set v(vars) { this.vars = vars; }
    get routes() { return (0, express_list_endpoints_1.default)(this.app); }
}
exports.OBAExpress = OBAExpress;
exports.default = OBAExpress;
//# sourceMappingURL=main.js.map