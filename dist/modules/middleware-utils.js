"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCORS = exports.morganMsgFormats = exports.morganMsgTokens = void 0;
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
exports.morganMsgTokens = {
    errLogMsg: (req) => {
        const msg = {
            id: req.id,
            //ts:new Date().toLocaleString("en-US",OB.locals.dateFormat as any),
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
    appuser: (req) => req.appuser,
    hostname: (req) => req.hostname,
    contentType: (req) => req.headers["content-type"],
    headers: (req) => req.headers ? JSON.stringify(req.headers) : "",
    query: (req) => req.query ? JSON.stringify(req.query) : "",
    params: (req) => req.params ? JSON.stringify(req.params) : "",
    body: (req) => req.body ? JSON.stringify(req.body) : "",
};
const accessTokenStrs = {
    //time:`"ts":":time"`,
    host: `"host":":hostname"`,
    ip: `"ip":":remote-addr"`,
    user: `"user":":appuser"`,
    referrer: `"referrer":":referrer"`,
    agent: `"agent":":user-agent"`,
    http: `"http":":http-version"`,
    method: `"method":":method"`,
    path: `"url":":url"`,
    resStatus: `"status"::status`,
    resSize: `"res-size"::res[content-length]`,
    resTime: `"res-time"::response-time`,
};
const accessLogMsg = "{" + Object.keys(accessTokenStrs).map(k => accessTokenStrs[k]).join(",") + "}";
exports.morganMsgFormats = {
    access: accessLogMsg,
    warn: `:errLogMsg`,
    error: `:errLogMsg`,
};
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