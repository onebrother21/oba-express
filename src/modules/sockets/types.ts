import {Enum,Keys} from "@onebro/oba-common";
import {Server,Socket,Namespace} from "socket.io";

export type SocketEventPayload = void|boolean|Namespace|Socket;
export type BaseSocketEvents = Enum<SocketEventPayload,"disconnecting"|"disconnect"|"error">;

export type SocketEvent<SocketData> = (data:SocketData) => SocketEventPayload|Promise<SocketEventPayload>;
export type SocketEventCreator<SocketData> = (io:Server,s?:Socket) => SocketEvent<SocketData>;
export type SocketEvents<Sockets> = {[k in Keys<Sockets>]:SocketEventCreator<Sockets[k]>;};

export type OBAExpressSocketsConfigType<Sockets> = SocketEvents<Sockets>;
export type OBAExpressSocketsServer = <Sockets>(o:OBAExpressSocketsConfigType<Sockets>) =>  Server;