import { Enum, Keys } from "@onebro/oba-common";
import { Server, Socket, Namespace } from "socket.io";
export declare type SocketEventPayload = void | boolean | Namespace | Socket;
export declare type BaseSocketEvents = Enum<SocketEventPayload, "disconnecting" | "disconnect" | "error">;
export declare type SocketEvent<SocketData> = (data: SocketData) => SocketEventPayload | Promise<SocketEventPayload>;
export declare type SocketEventCreator<SocketData> = (io: Server, s?: Socket) => SocketEvent<SocketData>;
export declare type SocketEvents<Sockets> = {
    [k in Keys<Sockets>]: SocketEventCreator<Sockets[k]>;
};
export declare type OBAExpressApiSocketsConfig<Sockets> = SocketEvents<Sockets>;
export declare type OBAExpressApiSocketsType = Server;
