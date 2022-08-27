import socketIo,{Socket} from "socket.io";
import {Server} from "http";
import {Keys} from "@onebro/oba-common";
import {OBAExpressSocketsConfigType, Sockkkkk} from "./types";

export type OBAExpressSocketsConfig<Sockets> = OBAExpressSocketsConfigType<Sockets>;

export class OBAExpressSockets {
  static init = async <Sockets>(config:OBAExpressSocketsConfig<Sockets>,httpServer:Server) => {
    const io = new socketIo.Server(httpServer,config.opts);
    io.on("connection",(s:Socket) => {
      const s_ = (s as any) as Sockkkkk;
      s_.listeners = {};
      s_.on = (name,callback) => {
        if(!s_.listeners[name]){s_.listeners[name] = [];}
        s_.listeners[name].push(callback);
      };
      s_.emit = (name,data) => {if(s_.listeners[name]){s_.callListeners(s_.listeners[name], data);}};
      s_.callListeners = (listeners,data) => {
        listeners.shift()(data);
        if(listeners.length){s_.callListeners(listeners,data);}
      };
      for(const k in config.events){
        const c = (config.events as any)[k];
        s_.on(k,c(io,s));
      }
    });
  return io;
  }
}
export default OBAExpressSockets;