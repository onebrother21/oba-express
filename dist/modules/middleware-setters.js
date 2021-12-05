"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.getMiddlewares = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const csurf_1 = __importDefault(require("csurf"));
const lusca_1 = __importDefault(require("lusca"));
const express_flash_1 = __importDefault(require("express-flash"));
const passport_1 = __importDefault(require("passport"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const middleware_utils_1 = require("./middleware-utils");
const oba_common_1 = __importStar(require("@onebro/oba-common"));
const getMiddlewares = () => ({
    disablePoweredBy: (a, o) => { o ? a.disable("x-powered-by") : null; },
    compression: (a, o) => { o ? a.use((0, compression_1.default)()) : null; },
    flash: (a, o) => { o ? a.use((0, express_flash_1.default)()) : null; },
    errorhandler: (a, o) => { o ? a.use((0, errorhandler_1.default)()) : null; },
    morgan: (a, o, api) => {
        const { useDev, useLogger } = o;
        const { logger: { file: fileLogger, db: dbLogger } } = api;
        const formats = middleware_utils_1.morganMsgFormats;
        const formatFlags = {
            "access": `{"type":"ACCESS"}`,
            "warn": `{"type":"WARN"}`,
            "error": `{"type":"ERROR"}`,
            "info": `{"type":"INFO"}`,
        };
        const makeMorganOpts = (k) => ({
            skip: (req) => k == "error" ? !req.error : k == "warn" ? !req.warning : false,
            stream: { write: (str) => __awaiter(void 0, void 0, void 0, function* () {
                    const d = dbLogger.info;
                    const f = fileLogger[k].bind(fileLogger);
                    const flag = formatFlags[k];
                    const meta = JSON.parse(str);
                    let info;
                    try {
                        info = yield d(flag, { meta });
                    } //OB.here("l",info);}
                    catch (e) {
                        oba_common_1.default.here("w", e);
                        try {
                            info = f(str);
                        }
                        catch (e_) {
                            throw e_;
                        }
                    }
                }) }
        });
        for (const k in middleware_utils_1.morganMsgTokens)
            morgan_1.default.token(k, middleware_utils_1.morganMsgTokens[k]);
        if (useDev)
            a.use((0, morgan_1.default)("dev"));
        if (useLogger)
            for (const k in formats) {
                const K = k;
                const opts = makeMorganOpts(K);
                a.use((0, morgan_1.default)(formats[K], opts));
            }
    },
    cors: (a, o, api) => {
        const { origins, preflightContinue, credentials } = o;
        const opts = {
            preflightContinue,
            credentials,
            origin: (origin, done) => {
                //const whitelist = [...origins,...api.vars.whitelist];
                (0, middleware_utils_1.checkCORS)({ origin, origins }) ? done() : done(api.e._.cors());
            }
        };
        a.use((0, cors_1.default)(opts));
    },
    cookieParser: (a, o) => { a.use((0, cookie_parser_1.default)(o.secret)); },
    bodyParser: (a, o) => { for (const k in o)
        a.use(express_1.default[k](o[k])); },
    session: (a, o) => {
        const store = o.store ? connect_mongo_1.default.create(o.store) : null;
        const opts = Object.assign(o, { store });
        a.use((0, express_session_1.default)(opts));
    },
    csrf: (a, o) => {
        const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            res.cookie("XSRF-TOKEN", req.csrfToken());
            return next();
        });
        a.use((0, csurf_1.default)(o));
        a.use(handler);
    },
    lusca: (a, o) => {
        const csrfCookie = o.csrf && o.csrf.cookie ? o.csrf.cookie : null;
        const cookieName = oba_common_1.default.str(csrfCookie) ? csrfCookie : csrfCookie.name;
        const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
            const csrf = req.cookies[cookieName];
            if (csrf)
                req.body && csrf ? (req.body._csrf = csrf) : null && oba_common_1.default.here("t", { csrf });
            return next();
        });
        //OB.trace({csrfCookie});
        csrfCookie ? a.use(handler) : null;
        a.use((0, lusca_1.default)(o));
    },
    passport: (a) => { a.use(passport_1.default.initialize()); },
    public: (a, o) => {
        const publicPath = path_1.default.join(o.dirname, "public");
        a.use(express_1.default.static(publicPath, o));
    },
    views: (a, o) => {
        a.set("views", path_1.default.join(o.dirname, "../views"));
        a.set("view engine", o.engine);
    },
    pageNotFound: (a, o, api) => { a.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () { return next(api.e._.notfound()); })); },
    finalHandler: (a, o, api) => {
        const handler = (e, req, res, next) => {
            let _e;
            switch (true) {
                case e instanceof oba_common_1.AppError:
                    _e = e;
                    break;
                case !!e.errors:
                    _e = Object.assign(api.e._.validation(), e);
                    break;
                default:
                    _e = api.e.map(e);
                    break;
            }
            if (_e.warning) {
                oba_common_1.default.here("w", _e);
                req.warning = _e;
            }
            if (_e.status >= 500) {
                oba_common_1.default.here("e", _e);
                req.error = _e;
            }
            if (res.headersSent) {
                oba_common_1.default.here("w", "response already sent", _e.message);
                return;
            }
            res.status(_e.status).json({
                name: _e.name,
                message: _e.message,
                errors: _e.errors,
                status: _e.status,
                code: _e.code,
                info: _e.info,
            });
        };
        a.use(handler);
    },
});
exports.getMiddlewares = getMiddlewares;
//# sourceMappingURL=middleware-setters.js.map