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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCORS = exports.morganMsgFormats = exports.morganMsgTokens = void 0;
const oba_common_1 = __importStar(require("@onebro/oba-common"));
exports.morganMsgTokens = {
    errLogMsg: (req) => {
        const msg = {
            id: !req.id ? oba_common_1.default.longId() : req.id,
            time: new Date().toLocaleString("en-US", oba_common_1.defaultLocals.dateFormat),
            appName: req.appname,
            name: req.error ? req.error.name : "",
            msg: req.error ? req.error.message : "",
            warning: req.error && req.error.warning ? req.error.warning : false,
            code: req.error && req.error.code ? req.error.code.toString() : "",
            info: req.error && req.error.info ? JSON.stringify(req.error.info) : {},
            errors: req.error && req.error.errors ? JSON.stringify(req.error.errors) : {},
            stack: req.error ? req.error.stack : "",
        };
        return JSON.stringify(msg);
    },
    accessLogMsg: (req) => {
        const msg = {
            time: new Date().toLocaleString("en-US", oba_common_1.defaultLocals.dateFormat),
            hostname: req.hostname,
            appName: req.appname,
            contentType: req.headers["content-type"],
            headers: req.headers ? JSON.stringify(req.headers) : "",
            query: req.query ? JSON.stringify(req.query) : "",
            params: req.params ? JSON.stringify(req.params) : "",
            body: req.body ? JSON.stringify(req.body) : "",
        };
        return JSON.stringify(msg);
    },
};
//"ip"::remote-addr,
const defaultTknStr1 = `{"host":":req["hostname"]","user":":remote-user","referrer":":referrer","agent":":user-agent","http":":http-version",`;
const defaultTknStr2 = `"method":":method","path":":url","res-status"::status,"res-size"::res[content-length],"res-time"::response-time}`;
const defaultTknStr = defaultTknStr1 + defaultTknStr2;
const accessMsgStr = `:accessLogMsg`;
exports.morganMsgFormats = {
    access: defaultTknStr,
    //warn:`:errLogMsg`,
    //error:`:errLogMsg`,
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