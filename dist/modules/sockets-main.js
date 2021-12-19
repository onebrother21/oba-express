"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBAExpressApiSockets = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
class OBAExpressApiSockets {
}
exports.OBAExpressApiSockets = OBAExpressApiSockets;
OBAExpressApiSockets.init = (config, httpServer) => {
    const io = new socket_io_1.default.Server(httpServer);
    io.on("connection", (s) => { for (const k in config)
        s.on(k, config[k](io, s)); });
    return io;
};
exports.default = OBAExpressApiSockets;
//# sourceMappingURL=sockets-main.js.map