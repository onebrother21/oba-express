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
exports.CommonMiddleware = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
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
const common_middleware_utils_1 = require("./common-middleware-utils");
const oba_common_1 = __importStar(require("@onebro/oba-common"));
exports.CommonMiddleware = {
    disablePoweredBy: (a, o) => { o ? a.disable("x-powered-by") : null; },
    compression: (a, o) => { o ? a.use((0, compression_1.default)()) : null; },
    flash: (a, o) => { o ? a.use((0, express_flash_1.default)()) : null; },
    errorhandler: (a, o) => { o ? a.use((0, errorhandler_1.default)()) : null; },
    morgan: (a, o, api) => {
        const { useDev, useLogger } = o;
        const { logger } = api;
        for (const k in common_middleware_utils_1.morganMsgTokens)
            morgan_1.default.token(k, common_middleware_utils_1.morganMsgTokens[k]);
        if (useDev && !oba_common_1.default.isEnv("prod"))
            a.use((0, morgan_1.default)("dev"));
        if (useLogger)
            for (const k in common_middleware_utils_1.morganMsgFormats) {
                const K = k;
                const format = common_middleware_utils_1.morganMsgFormats[K];
                const skip = (req) => k == "error" ? !req.error : k == "warn" ? !req.warning : false;
                const stream = { write: logger.postLogMsg.bind(logger, K) };
                const opts = { skip, stream };
                a.use((0, morgan_1.default)(format, opts));
            }
    },
    cors: (a, o, api) => {
        const { origins } = o, corsOpts = __rest(o, ["origins"]);
        const opts = Object.assign(Object.assign({}, corsOpts), { origin: (origin, done) => {
                const allowed = (0, common_middleware_utils_1.validateCORS)({ origin, origins });
                return allowed ? done(null, true) : (() => {
                    console.log(api.e._.cors());
                    done(api.e._.cors(), false);
                })();
            } });
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
                req.body && csrf ? (req.body._csrf = csrf) : null && oba_common_1.default.trace({ csrf });
            return next();
        });
        //OB.trace({csrfCookie});
        csrfCookie ? a.use(handler) : null;
        a.use((0, lusca_1.default)(o));
    },
    passport: (a) => { a.use(passport_1.default.initialize()); },
    public: (a, o) => { o.dirname ? a.use(express_1.default.static(o.dirname, o)) : null; },
    views: (a, o) => {
        if (o.dirname && o.engine) {
            a.set("views", o.dirname);
            a.set("view engine", o.engine);
        }
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
                //OB.warn(_e);
                req.warning = _e;
            }
            else if (_e.status >= 500) {
                req.error = _e;
            }
            //OB.error(_e);
            if (res.headersSent) {
                oba_common_1.default.warn("response already sent", _e.message);
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
};
exports.default = exports.CommonMiddleware;
//# sourceMappingURL=common-middleware.js.map