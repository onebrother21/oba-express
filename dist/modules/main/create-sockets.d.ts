import { OBAExpressType } from "./types";
import { Server as SocketServer } from "socket.io";
export declare const createSockets: <S>(api: OBAExpressType<undefined, S>) => Promise<SocketServer>;
