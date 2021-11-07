"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBAExpressApiSockets = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
class OBAExpressApiSockets {
    constructor(config, server) {
        const io = new socket_io_1.default.Server(server);
        io.on("connection", (s) => { for (const k in config)
            s.on(k, config[k](io, s)); });
        return io;
    }
}
exports.OBAExpressApiSockets = OBAExpressApiSockets;
exports.default = OBAExpressApiSockets;
__exportStar(require("./sockets-types"), exports);
//# sourceMappingURL=sockets-main.js.map