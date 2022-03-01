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
exports.notifyApiUser = exports.sendRequest = exports.sendResponse = exports.refreshApiUser = exports.handleApiAction = exports.validateReq = exports.validateApiUserRole = exports.validateApiUser = exports.verifyTkn = exports.generateTkn = exports.mapUserRole = exports.readCert = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const oba_common_1 = __importStar(require("@onebro/oba-common"));
const readCert = () => {
    const certFile = path_1.default.resolve(__dirname, "ssl/client.crt");
    const keyFile = path_1.default.resolve(__dirname, "ssl/client.key");
    const caFile = path_1.default.resolve(__dirname, "ssl/ca.cert.pem");
    const SSLCertInfo = {
        cert: fs_1.default.readFileSync(certFile),
        key: fs_1.default.readFileSync(keyFile),
        passphrase: "password",
        ca: fs_1.default.readFileSync(caFile)
    };
    return SSLCertInfo;
};
exports.readCert = readCert;
const mapUserRole = (roles, role) => {
    const keys = Object.keys(roles);
    if (!role)
        return keys[0];
    else
        return keys.find(r => roles[r] == role);
};
exports.mapUserRole = mapUserRole;
const generateTkn = (payload, secret, opts) => jsonwebtoken_1.default.sign(payload, secret, opts);
exports.generateTkn = generateTkn;
const verifyTkn = (token, secret) => jsonwebtoken_1.default.verify(token, secret);
exports.verifyTkn = verifyTkn;
const validateApiUser = (cookieName, ekey, authSecret) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cookie = req.cookies[cookieName];
            const header = req.headers.authorization;
            const parts = (header === null || header === void 0 ? void 0 : header.split(" ")) || [];
            const valid = parts.length == 2 && ["Bearer", "Token"].includes(parts[0]) && oba_common_1.default.str(parts[1]);
            const token = valid ? parts[1] : null;
            if (!token)
                throw new oba_common_1.AppError({
                    message: "Not Authorized",
                    status: 401
                });
            req.appuser = cookie ? oba_common_1.default.decrypt(ekey, cookie) : null;
            req.authtkn = (0, exports.verifyTkn)(token, authSecret);
            return next();
        }
        catch (e) {
            return next(e);
        }
    });
    return handler;
};
exports.validateApiUser = validateApiUser;
const validateApiUserRole = (roles) => {
    const keys = Object.keys(roles);
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { role } = req.authtkn;
        const badRole = !keys.includes(role);
        if (badRole)
            return next(new oba_common_1.AppError({ message: "unauthorized", status: 401 }));
        return next();
    });
    return handler;
};
exports.validateApiUserRole = validateApiUserRole;
const validateReq = (validators) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty())
            return next();
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));
        return next({ errors: extractedErrors });
    });
    return [...validators, handler];
};
exports.validateReq = validateReq;
const handleApiAction = (action, statusOK = 200) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user, data, auth } = yield action(req);
            res.locals.user = user,
                res.locals.data = data,
                res.locals.auth = auth,
                res.locals.status = statusOK;
            return next();
        }
        catch (e) {
            return next(e);
        }
    });
    return handler;
};
exports.handleApiAction = handleApiAction;
const refreshApiUser = (cookieName, ekey, authSecret) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const appuser = res.locals.user || req.appuser;
            const appuserEnc = appuser ? oba_common_1.default.encrypt(ekey, appuser) : null;
            const token = (0, exports.generateTkn)({ appuser, okto: "use-api", role: "USER" }, authSecret);
            if (appuserEnc)
                res.cookie(cookieName, appuserEnc, { maxAge: 900000, httpOnly: true });
            res.locals.token = res.locals.auth ? token : null;
            return next();
        }
        catch (e) {
            return next(e);
        }
    });
    return handler;
};
exports.refreshApiUser = refreshApiUser;
const sendResponse = () => {
    const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () { return res.status(res.locals.status).json(res.locals); });
    return handler;
};
exports.sendResponse = sendResponse;
const sendRequest = (o) => __awaiter(void 0, void 0, void 0, function* () {
    const fetch = (yield require("node-fetch")).default;
    try {
        //if(opts.ssl) opts = Object.assign({},opts,{});//SSLCertInfo);//readCert();
        const { url } = o, opts = __rest(o, ["url"]);
        const res = yield fetch(url, opts);
        const data = yield res.json();
        if (!res.ok)
            throw res.text();
        else
            return data;
    }
    catch (e) {
        oba_common_1.default.error(e.message);
        throw e;
    }
});
exports.sendRequest = sendRequest;
const notifyApiUser = (o, doSend) => __awaiter(void 0, void 0, void 0, function* () { return doSend ? oba_common_1.default.ok(o) : null; });
exports.notifyApiUser = notifyApiUser;
//# sourceMappingURL=middleware-handlers.js.map