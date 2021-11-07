import socketIo,{Socket} from "socket.io";
import {Server} from "http";
import {OBAExpressApiSocketsType,OBAExpressApiSocketsConfig} from "./sockets-types";
import { Keys } from "@onebro/oba-common";

export interface OBAExpressApiSockets<Sockets> extends OBAExpressApiSocketsType {}
export class OBAExpressApiSockets<Sockets> {
  constructor(config:OBAExpressApiSocketsConfig<Sockets>,server:Server){
    const io = new socketIo.Server(server);
    io.on("connection",(s:Socket) => {for(const k in config) s.on(k,config[k as Keys<Sockets>](io,s));});
    return io;
  }
}
export default OBAExpressApiSockets;
export * from "./sockets-types";