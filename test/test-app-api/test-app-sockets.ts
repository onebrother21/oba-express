import { TestAppApiConfig, TestAppApi } from "./test-app-types";
import OB from "@onebro/oba-common";

const users = new Set<string>();
export const getSockets = (s:string,api:TestAppApi):Partial<TestAppApiConfig["sockets"]> => ({
  "user_connected":(io) => o => {OB.here("l",o.id);users.add(o.username);io.emit("user_connected",[...users]);},
  "user_disconnected":(io) => o => {users.delete(o.username);io.emit("user_disconnected",o.username);},
  "room":(io,s) => (room:string) => s.join(room),
  "chat_message":(io,s) => ({room,...data}) => (room?s.broadcast.to(room):io).emit("chat_message",data),
  "info_message":(io,s) => ({room,...data}) => (room?s.broadcast.to(room):io).emit("info_message",data),
  "typing":(io,s) => data => s.broadcast.emit("typing",data),
});