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
const dev_1 = require("./dev");
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
module.exports = (() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { api } = yield (0, dev_1.testAppApiConfig)("OBA_EXPRESS");
        yield api.init(1, 1);
    }
    catch (e) {
        oba_common_1.default.error(e);
        throw e;
    }
}))();
//# sourceMappingURL=server.js.map