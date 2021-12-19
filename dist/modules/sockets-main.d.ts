import socketIo from "socket.io";
import { Server } from "http";
import { OBAExpressApiSocketsConfigType } from "./sockets-types";
export declare type OBAExpressApiSocketsConfig<Sockets> = OBAExpressApiSocketsConfigType<Sockets>;
export declare class OBAExpressApiSockets {
    static init: <Sockets>(config: OBAExpressApiSocketsConfig<Sockets>, httpServer: Server) => socketIo.Server<import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap, import("socket.io/dist/typed-events").DefaultEventsMap>;
}
export default OBAExpressApiSockets;
