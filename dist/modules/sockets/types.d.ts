import { Enum, Keys } from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";
import { Server, Socket, Namespace } from "socket.io";
import { OBAExpressMiddlewareConfig } from "../middleware";
export declare type SocketEventPayload = void | boolean | Namespace | SocketWrapper;
export declare type SocketEventListener<SocketData> = (data: SocketData) => Promise<SocketEventPayload>;
export declare type SocketEventCreator<SocketData> = (io: Server, s?: SocketWrapper) => SocketEventListener<SocketData>;
export declare type SocketWrapper = Omit<Socket, "on" | "emit" | "listeners"> & {
    listeners: Partial<Enum<SocketEventListener<any>[], string>>;
    on: (name: string, cb: SocketEventListener<any>) => void;
    emit: (name: string, data: any) => void;
    callListeners: (listeners: SocketEventListener<any>[], data: any) => void;
};
export declare type BaseSocketEvents = Enum<SocketEventCreator<void>, "disconnecting" | "disconnect" | "error">;
export declare type SocketEvents<Sockets> = {
    [k in Keys<Sockets>]: SocketEventCreator<Sockets[k]>;
};
export declare type OBAExpressSocketsConstructor<Sockets> = (app: OBACore) => Promise<SocketEvents<Sockets>>;
export declare type OBAExpressSocketsConfig<Sockets> = {
    opts: {
        cors: OBAExpressMiddlewareConfig["common"]["cors"];
    };
    events: OBAExpressSocketsConstructor<Sockets>;
};
