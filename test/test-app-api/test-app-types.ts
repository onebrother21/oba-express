import {OBAExpressApiConfig,OBAExpressApi,CustomHandlers,MainApiConstructor} from "../../src";
import {Enum,AnyBoolean} from "@onebro/oba-common";

export type DefaultEvents = Enum<boolean,"init"|"shutdown"> & {
  config:OBAExpressApiConfig<DefaultEvents,DefaultSockets>;
  isActive:AnyBoolean;
  ready:boolean;
  serverOK:Enum<string,"name"|"env"|"host"> & {port:number;};
  dbOK:{name:string,uri:string};
  test:number;
  test2:number;
};

export type SocketUser = {id:string;username:string;role:string;};
export type SocketUserMsg = {room?:string;username:string,message:string;};
export type SocketUserTyping = {isTyping:boolean;username:string;};
export type DefaultSockets = {
  user_connected:SocketUser;
  user_disconnected:SocketUser;
  room:string;
  chat_message:SocketUserMsg;
  info_message:SocketUserMsg;
  typing:SocketUserTyping;
};

export type TestAppApiHandlers = CustomHandlers<DefaultEvents,DefaultSockets>;
export type TestAppMainApi = MainApiConstructor<DefaultEvents,DefaultSockets>;
export type TestAppApiConfig = OBAExpressApiConfig<DefaultEvents,DefaultSockets>;
export interface TestAppApi extends OBAExpressApi<DefaultEvents,DefaultSockets> {}
export class TestAppApi extends OBAExpressApi<DefaultEvents,DefaultSockets> {}