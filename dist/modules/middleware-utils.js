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
    id: (req) => !req.id ? oba_common_1.default.longId() : req.id,
    timestamp: () => new Date().toLocaleString("en-US", oba_common_1.appLocals.dateFormat),
    hostname: (req) => req.hostname,
    appName: (req) => req.appname,
    contentType: (req) => req.headers["content-type"],
    headers: (req) => req.headers ? JSON.stringify(req.headers) : "",
    query: (req) => req.query ? JSON.stringify(req.query) : "",
    params: (req) => req.params ? JSON.stringify(req.params) : "",
    body: (req) => req.body ? JSON.stringify(req.body) : "",
    errName: (req) => req.error ? req.error.name : "",
    errMsg: (req) => req.error ? req.error.message : "",
    errWarning: (req) => req.error && req.error.warning ? req.error.warning.toString() : "",
    errCode: (req) => req.error && req.error.code ? req.error.code.toString() : "",
    errInfo: (req) => req.error && req.error.info ? JSON.stringify(req.error.info) : "",
    errErrors: (req) => req.error && req.error.errors ? JSON.stringify(req.error.errors) : "",
    errStack: (req) => req.error ? req.error.stack : "",
};
const accessMsgStr = `{
  reqId::id,
  time:":timestamp",
  hostname:":hostname",
  appname:":appName",
  user::remote-user,
  ip::remote-addr,
  referrer::referrer,
  agent::user-agent,
  http::http-version,
  method::method,
  path::url,
  res-status::status,
  res-size::res[content-length],
  res-time::response-time}`;
const errorMsgStr = `{
  reqId::id,
  time:":timestamp",
  name::errName,
  message:":errMsg",
  warning::errWarning,
  status::status,
  code::errCode,
  info:":errInfo",
  errors:":errErrors",
  stack::errStack,}`;
exports.morganMsgFormats = { access: accessMsgStr, warn: errorMsgStr, error: errorMsgStr };
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