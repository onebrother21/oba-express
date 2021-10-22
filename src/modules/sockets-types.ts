import {Enum} from "@onebro/oba-common";
import {Server,Socket,Namespace} from "socket.io";

export type SocketUser = {id:string;username:string;role:string;};
export type SocketUserMsg = {room?:string;username:string,message:string;};
export type SocketUserTyping = {isTyping:boolean;username:string;};

export type SocketEventName = "user_connected"|"user_disconnected"|"room"|"chat_message"|"info_message"|"typing";
export type SocketEventPayloadObj = Enum<SocketEventName,any>;
export interface SocketEventPayloads extends SocketEventPayloadObj {
  user_connected:SocketUser;
  user_disconnected:SocketUser;
  room:string;
  chat_message:SocketUserMsg;
  info_message:SocketUserMsg;
  typing:SocketUserTyping;}
export type SocketActionType = void|boolean|Namespace|Socket;
export type SocketAction<T = unknown> = (data:T) => SocketActionType|Promise<SocketActionType>;
export type SocketActionCreator<T = unknown> = (io:Server,s:Socket) => SocketAction<T>;
export type SocketEvent<T = unknown> = {name:SocketEventName;action?:SocketActionCreator<T>;};
export interface OBAExpressApiSocketsConfig {events:SocketEvent[];}
export interface OBAExpressApiSocketsType extends Server {}