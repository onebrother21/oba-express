import { OBAExpressType } from "./types";
import { Server as SocketServer } from "socket.io";
export declare const createSockets: (api: OBAExpressType) => Promise<SocketServer>;
