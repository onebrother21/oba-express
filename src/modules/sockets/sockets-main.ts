import socketIo,{Socket} from "socket.io";
import {Server} from "http";
import {Keys} from "@onebro/oba-common";
import {OBAExpressSocketsConfigType} from "./sockets-types";

export type OBAExpressSocketsConfig<Sockets> = OBAExpressSocketsConfigType<Sockets>;

export class OBAExpressSockets {
  static init = <Sockets>(config:OBAExpressSocketsConfig<Sockets>,httpServer:Server) => {
    const io = new socketIo.Server(httpServer);
    io.on("connection",(s:Socket) => {for(const k in config) s.on(k,config[k as Keys<Sockets>](io,s));});
    return io;
  }
}
export default OBAExpressSockets;