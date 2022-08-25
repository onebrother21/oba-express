import socketIo,{Socket} from "socket.io";
import {Server} from "http";
import {Keys} from "@onebro/oba-common";
import {OBAExpressSocketsConfigType} from "./types";

export type OBAExpressSocketsConfig<Sockets> = OBAExpressSocketsConfigType<Sockets>;

export class OBAExpressSockets {
  static init = <Sockets>(config:OBAExpressSocketsConfig<Sockets>,httpServer:Server) => {
    const io = new socketIo.Server(httpServer,config.opts);
    io.on("connection",(s:Socket) => {for(const k in config.events) s.on(k,config.events[k as Keys<Sockets>](io,s));});
    return io;
  }
}
export default OBAExpressSockets;