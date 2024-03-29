import socketIo from "socket.io";
import { Server } from "http";
import { OBAExpressSocketsConfigType } from "./types";
export declare type OBAExpressSocketsConfig<Sockets> = OBAExpressSocketsConfigType<Sockets>;
export declare class OBAExpressSockets {
    static init: <Sockets>(config: OBAExpressSocketsConfig<Sockets>, httpServer: Server) => Promise<socketIo.Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, any>>;
}
export default OBAExpressSockets;
