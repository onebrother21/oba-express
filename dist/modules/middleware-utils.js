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
exports.checkCORS = exports.makeMorganOpts = exports.morganMsgFormatFlags = exports.morganMsgFormats = exports.morganMsgTokens = void 0;
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
exports.morganMsgTokens = {
    errLogMsg: (req) => {
        const msg = {
            id: req.id,
            ts: new Date().toLocaleString("en-US", oba_common_1.default.locals.dateFormat),
            name: req.error ? req.error.name : "",
            msg: req.error ? req.error.message : "",
            stack: req.error ? req.error.stack : "",
        };
        req.error && req.error.warning ? msg.warning = req.error.warning : null;
        req.error && req.error.code ? msg.code = req.error.code : null;
        req.error && req.error.info ? msg.info = req.error.info : null;
        req.error && req.error.errors ? msg.errors = req.error.errors : null;
        return JSON.stringify(msg);
    },
    time: () => new Date().toLocaleString("en-US", oba_common_1.default.locals.dateFormat),
    hostname: (req) => req.hostname,
    contentType: (req) => req.headers["content-type"],
    headers: (req) => req.headers ? JSON.stringify(req.headers) : "",
    query: (req) => req.query ? JSON.stringify(req.query) : "",
    params: (req) => req.params ? JSON.stringify(req.params) : "",
    body: (req) => req.body ? JSON.stringify(req.body) : "",
};
const accessTokenStrs = {
    time: `"ts":":time"`,
    host: `"host":":hostname"`,
    user: `"user":":remote-user"`,
    ip: `"ip":":remote-addr"`,
    referrer: `"referrer":":referrer"`,
    agent: `"agent":":user-agent"`,
    http: `"http":":http-version"`,
    method: `"method":":method"`,
    path: `"path":":url"`,
    resStatus: `"status"::status`,
    resSize: `"size"::res[content-length]`,
    resTime: `"time"::response-time`,
};
const accessLogMsg = "{" + Object.keys(accessTokenStrs).map(k => accessTokenStrs[k]).join(",") + "}";
exports.morganMsgFormats = {
    access: accessLogMsg,
    warn: `:errLogMsg`,
    error: `:errLogMsg`,
};
exports.morganMsgFormatFlags = {
    "access": "ACCESS",
    "warn": "WARN",
    "error": "ERROR",
    "info": "INFO",
};
const makeMorganOpts = (logger, k) => ({
    skip: (req) => k == "error" ? !req.error : k == "warn" ? !req.warning : false,
    stream: { write: (str) => __awaiter(void 0, void 0, void 0, function* () {
            const { file: fileLogger, db: dbLogger, dbCustom } = logger;
            const c = dbCustom[k];
            const d = dbLogger.info;
            const f = fileLogger[k].bind(fileLogger);
            const flag = exports.morganMsgFormatFlags[k];
            const meta = JSON.parse(str);
            let info;
            try {
                info = yield c(meta);
            }
            catch (e) {
                oba_common_1.default.warn(e);
                try {
                    yield oba_common_1.default.sleep(5);
                    info = yield d(flag, { meta });
                }
                catch (e) {
                    oba_common_1.default.warn(e);
                    try {
                        info = f(str);
                    }
                    catch (e_) {
                        throw e_;
                    }
                }
            }
        }) }
});
exports.makeMorganOpts = makeMorganOpts;
const checkCORS = ({ origin, origins, whitelist, blacklist }) => {
    if (!origin)
        return false;
    if (origins)
        for (let i = 0, l = origins.length; i < l; i++)
            if (oba_common_1.default.match(new RegExp(origins[i]), origin))
                return true;
    if (whitelist)
        for (let i = 0, l = whitelist.length; i < l; i++)
            if (oba_common_1.default.match(new RegExp(whitelist[i].id), origin))
                return true;
    if (blacklist)
        for (let i = 0, l = blacklist.length; i < l; i++)
            if (oba_common_1.default.match(new RegExp(blacklist[i].id), origin))
                return false;
    return false;
};
exports.checkCORS = checkCORS;
//# sourceMappingURL=middleware-utils.js.map