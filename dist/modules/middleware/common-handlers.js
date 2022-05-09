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
exports.sendResponse = exports.refreshApiUser = exports.handleApiAction = exports.validateApiReq = exports.validateApiUserRole = exports.validateApiUser = exports.validateTkn = exports.generateTkn = exports.mapUserRole = void 0;
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
const validateTkn = (token, secret) => jsonwebtoken_1.default.verify(token, secret);
exports.validateTkn = validateTkn;
const validateApiUser = (cookieName, ekey, authSecret) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cookie = req.cookies[cookieName];
            const appuser = cookie ? oba_common_1.default.decrypt(ekey, cookie) : null;
            const header = req.headers.authorization;
            const headerParts = (header === null || header === void 0 ? void 0 : header.split(" ")) || [];
            const validTknFormat = headerParts.length == 2 && ["Bearer", "Token"].includes(headerParts[0]) && oba_common_1.default.str(headerParts[1]);
            const token = validTknFormat ? (0, exports.validateTkn)(headerParts[1], authSecret) : null;
            if (!token)
                throw new oba_common_1.AppError({
                    message: "Not Authorized",
                    status: 401
                });
            else {
                req.appuser = appuser;
                req.authtkn = token;
                return next();
            }
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
        const { role } = req.authtkn;
        const badRole = !Object.keys(roles).includes(role);
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
            const token = res.locals.auth ? (0, exports.generateTkn)({ appuser, okto: "use-api", role: "USER" }, authSecret) : null;
            if (appuserEnc)
                res.cookie(cookieName, appuserEnc, { maxAge: 900000, httpOnly: true });
            res.locals.token = token;
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
//# sourceMappingURL=common-handlers.js.map