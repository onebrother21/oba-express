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
exports.sendResponse = exports.refreshApiUser = exports.handleApiAction = exports.validateApiReq = exports.validateApiUserRole = exports.validateApiUser = exports.verifyTkn = exports.generateTkn = exports.mapUserRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const oba_common_1 = __importStar(require("@onebro/oba-common"));
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
const validateApiUser = (o, authReq) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { cookie, ekey, secret } = o;
            if (cookie && ekey) {
                const appuser = req.cookies[cookie];
                const userinfo = cookie ? oba_common_1.default.decrypt(ekey, appuser) : null;
                req.role = userinfo.split("/")[0];
                req.user = (userinfo.split("/")[1]).split(":")[0];
                req.device = userinfo.split(":")[1];
            }
            if (secret) {
                const header = req.headers.authorization;
                const headerParts = (header === null || header === void 0 ? void 0 : header.split(" ")) || [];
                const validTknFormat = headerParts.length == 2 && ["Bearer", "Token"].includes(headerParts[0]) && oba_common_1.default.str(headerParts[1]);
                const token = validTknFormat ? (0, exports.verifyTkn)(headerParts[1], secret) : null;
                req.token = token;
            }
            if (authReq && !(req.user && req.token))
                throw new oba_common_1.AppError({
                    message: "Not Authorized",
                    status: 401
                });
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
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const badRole = !Object.keys(roles).includes(req.role);
        if (badRole)
            return next(new oba_common_1.AppError({ message: "unauthorized", status: 401 }));
        return next();
    });
    return handler;
};
exports.validateApiUserRole = validateApiUserRole;
const validateApiReq = (validators) => {
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
exports.validateApiReq = validateApiReq;
const handleApiAction = (action, statusOK = 200) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user, device, role, okto, data, auth } = yield action(req);
            res.locals.data = data,
                res.locals.okto = okto;
            res.locals.auth = !!auth,
                res.locals.user = user || req.user,
                res.locals.device = device || req.device,
                res.locals.role = role || req.role,
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
const refreshApiUser = (o) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { cookie, ekey, secret } = o;
            if (cookie && ekey) {
                const userinfo = `${res.locals.role}/${res.locals.user}:${res.locals.device}`;
                const appuser = userinfo ? oba_common_1.default.encrypt(ekey, userinfo) : null;
                appuser ? res.cookie(cookie, appuser, { maxAge: 900000, httpOnly: true }) : null;
            }
            if (secret) {
                const token = res.locals.auth ? (0, exports.generateTkn)({
                    user: res.locals.user,
                    device: res.locals.device,
                    role: res.locals.role,
                    okto: res.locals.okto,
                }, secret) : null;
                res.locals.token = token;
            }
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
    const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        delete res.locals.role;
        delete res.locals.device;
        delete res.locals.auth;
        delete res.locals.okto;
        res.status(res.locals.status).json(res.locals);
    });
    return handler;
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=common-handlers.js.map