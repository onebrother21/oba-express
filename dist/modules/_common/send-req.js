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
exports.notifyApiUser = exports.sendRequest = void 0;
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
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
//# sourceMappingURL=send-req.js.map