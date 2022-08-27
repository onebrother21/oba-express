import {OBAExpressType} from "./types";
import socketIo,{Socket,Server as SocketServer} from "socket.io";
import {SocketWrapper} from "../sockets";

export const createSockets = async (api:OBAExpressType):Promise<SocketServer> => {
  const {server,config:{sockets}} = api;
  const io = new socketIo.Server(server,sockets.opts);
  const socketCreators = await sockets.events(api);
  io.on("connection",(s:Socket) => {
    const s_ = (s as any) as SocketWrapper;
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
    for(const k in socketCreators){
      const c = (socketCreators as any)[k];
      s_.on(k,c(io,s));
    }
  });
  return io;
};