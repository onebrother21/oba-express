import { SocketEvent,SocketUser,SocketUserMsg,SocketUserTyping } from "../sockets-types";

const users = new Set<string>();

export const DefaultSockets:SocketEvent[] = [
  {name:"user_connected",action:(io) => (o:SocketUser) => {console.log(o.id);users.add(o.username);io.emit("user_connected",[...users]);}},
  {name:"user_disconnected",action:(io) => (o:SocketUser) => {users.delete(o.username);io.emit("user_disconnected",o.username);}},
  {name:"room",action:(io,s) => (room:string) => s.join(room)},
  {name:"chat_message",action:(io,s) => ({room,...data}:SocketUserMsg) => (room?s.broadcast.to(room):io).emit("chat_message",data)},
  {name:"info_message",action:(io,s) => ({room,...data}:SocketUserMsg) => (room?s.broadcast.to(room):io).emit("info_message",data)},
  {name:"typing",action:(io,s) => (data:SocketUserTyping) => s.broadcast.emit("typing",data)},
];