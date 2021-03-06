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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = exports.refreshApiUser = exports.handleApiAction = exports.validateApiReq = exports.validateApiUserRole = exports.validateApiUser = void 0;
const express_validator_1 = require("express-validator");
const oba_common_1 = __importStar(require("@onebro/oba-common"));
const common_handler_utils_1 = require("./common-handler-utils");
const validateApiUser = (o, authReq) => {
    const handler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { cookie, ekey, secret } = o;
            req.appuser = {};
            if (cookie && ekey) {
                const appuser = req.cookies[cookie];
                const userinfo = cookie && appuser ? oba_common_1.default.decrypt(ekey, appuser) : "";
                if (userinfo) {
                    req.appuser.role = userinfo.split("/")[0];
                    req.appuser.name = (userinfo.split("/")[1]).split(":")[0];
                    req.appuser.device = userinfo.split(":")[1];
                }
            }
            if (secret) {
                const header = req.headers.authorization;
                const headerParts = (header === null || header === void 0 ? void 0 : header.split(" ")) || [];
                const validTknFormat = headerParts.length == 2 && ["Bearer", "Token"].includes(headerParts[0]) && oba_common_1.default.str(headerParts[1]);
                const token = validTknFormat ? headerParts[1] : null;
                const tokendata = token ? (0, common_handler_utils_1.verifyTkn)(token, secret) : null;
                req.token = token;
                req.appuser = Object.assign(Object.assign({}, req.appuser), tokendata);
            }
            if (authReq && !req.token)
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
        const badRole = !roles.includes(req.appuser.role);
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
            const { role, name, device, okto, next: next_, auth, data } = yield action(req);
            req.appuser = Object.assign({}, req.appuser);
            res.locals.data = data,
                res.locals.role = role || req.appuser.role,
                res.locals.name = name || req.appuser.name,
                res.locals.device = device || req.appuser.device,
                res.locals.next = next_ || req.appuser.next,
                res.locals.okto = okto || req.appuser.okto,
                res.locals.auth = !!(auth || req.token),
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
            const { name, device, role, okto, auth, next: next_ } = res.locals;
            if (cookie && ekey && name) {
                const userstr = `${role || "-"}/${name}:${device}`;
                const appuser = oba_common_1.default.encrypt(ekey, userstr);
                res.cookie(cookie, appuser, { maxAge: 900000, httpOnly: true });
            }
            if (secret && auth)
                res.locals.token = (0, common_handler_utils_1.generateTkn)({ name, device, role, okto, next: next_ }, secret);
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
        const { status, data, token } = res.locals;
        res.status(status).json({ status, data, token });
    });
    return handler;
};
exports.sendResponse = sendResponse;
//# sourceMappingURL=common-handlers.js.map