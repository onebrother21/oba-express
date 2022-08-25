"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBAExpressSockets = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
class OBAExpressSockets {
}
exports.OBAExpressSockets = OBAExpressSockets;
OBAExpressSockets.init = (config, httpServer) => {
    const io = new socket_io_1.default.Server(httpServer, config.opts);
    io.on("connection", (s) => { for (const k in config)
        s.on(k, config.events[k](io, s)); });
    return io;
};
exports.default = OBAExpressSockets;
//# sourceMappingURL=main.js.map