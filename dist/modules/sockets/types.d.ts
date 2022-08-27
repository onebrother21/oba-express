import { Enum, Keys } from "@onebro/oba-common";
import { Server, Socket, Namespace } from "socket.io";
import { OBAExpressMiddlewareConfig } from "../middleware";
export declare type SocketEventPayload = void | boolean | Namespace | Sockkkkk;
export declare type SocketEventListener<SocketData> = (data: SocketData) => Promise<SocketEventPayload>;
export declare type SocketEventCreator<SocketData> = (io: Server, s?: Sockkkkk) => SocketEventListener<SocketData>;
export declare type Sockkkkk = Omit<Socket, "on" | "emit" | "listeners"> & {
    listeners: Partial<Enum<SocketEventListener<any>[], string>>;
    on: (name: string, cb: SocketEventListener<any>) => void;
    emit: (name: string, data: any) => void;
    callListeners: (listeners: SocketEventListener<any>[], data: any) => void;
};
export declare type BaseSocketEvents = Enum<SocketEventCreator<void>, "disconnecting" | "disconnect" | "error">;
export declare type SocketEvents<Sockets> = {
    [k in Keys<Sockets>]: SocketEventCreator<Sockets[k]>;
};
export declare type OBAExpressSocketsConfigType<Sockets> = {
    opts: {
        cors: OBAExpressMiddlewareConfig["common"]["cors"];
    };
    events: SocketEvents<Sockets>;
};
export declare type OBAExpressSocketsServer = <Sockets>(o: OBAExpressSocketsConfigType<Sockets>) => Server;
