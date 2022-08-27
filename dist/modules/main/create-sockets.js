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
exports.createSockets = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
const createSockets = (api) => __awaiter(void 0, void 0, void 0, function* () {
    const { server, config: { sockets } } = api;
    const io = new socket_io_1.default.Server(server, sockets.opts);
    const socketCreators = yield sockets.events(api);
    io.on("connection", (s) => {
        const s_ = s;
        s_.listeners = {};
        s_.on = (name, callback) => {
            if (!s_.listeners[name]) {
                s_.listeners[name] = [];
            }
            s_.listeners[name].push(callback);
        };
        s_.emit = (name, data) => { if (s_.listeners[name]) {
            s_.callListeners(s_.listeners[name], data);
        } };
        s_.callListeners = (listeners, data) => {
            listeners.shift()(data);
            if (listeners.length) {
                s_.callListeners(listeners, data);
            }
        };
        for (const k in socketCreators) {
            const c = socketCreators[k];
            s_.on(k, c(io, s));
        }
    });
    return io;
});
exports.createSockets = createSockets;
//# sourceMappingURL=create-sockets.js.map