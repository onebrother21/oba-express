import socketIo,{Socket} from "socket.io";
import {Server} from "http";
import {OBAExpressApiSocketsType,OBAExpressApiSocketsConfig,SocketActionCreator} from "./sockets-types";

export interface OBAExpressApiSockets extends OBAExpressApiSocketsType {}
export class OBAExpressApiSockets {
  constructor(config:OBAExpressApiSocketsConfig,server:Server){
    const io = new socketIo.Server(server);
    const {events} = config;
    const createSocket = (s:Socket,action?:SocketActionCreator) => action?action(io,s):undefined;
    io.on("connection",(socket:Socket) => events.forEach(({name,action}) => socket.on(name,createSocket(socket,action))));
    return io;}}
export default OBAExpressApiSockets;
export * from "./sockets-types";