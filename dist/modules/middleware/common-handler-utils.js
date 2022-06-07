"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTkn = exports.generateTkn = exports.mapUserRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
const mapUserRole = (roles, role) => {
    const keys = oba_common_1.default.props(roles);
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
//# sourceMappingURL=common-handler-utils.js.map