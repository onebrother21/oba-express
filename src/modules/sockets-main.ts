import socketIo,{Socket} from "socket.io";
import {Server} from "http";
import {Keys} from "@onebro/oba-common";
import {OBAExpressApiSocketsConfigType} from "./sockets-types";

export type OBAExpressApiSocketsConfig<Sockets> = OBAExpressApiSocketsConfigType<Sockets>;

export class OBAExpressApiSockets {
  static init = <Sockets>(config:OBAExpressApiSocketsConfig<Sockets>,httpServer:Server) => {
    const io = new socketIo.Server(httpServer);
    io.on("connection",(s:Socket) => {for(const k in config) s.on(k,config[k as Keys<Sockets>](io,s));});
    return io;
  }
}
export default OBAExpressApiSockets;