import express from "express";
import {Server as HttpServer} from "http";
import {Server as SocketServer} from "socket.io";
import OBACoreApi,{OBACoreConfig} from "@onebro/oba-core-api";
import {OBAExpressApiVars} from "./vars-types";
import {OBAExpressApiMiddlewareConfig} from "./middleware-types";
import {OBAExpressApiSocketsConfig} from "./sockets-main";
import { RouterEndpoint } from "./middleware-handler-types";
import { AnyBoolean } from "@onebro/oba-common";


export type OBAExpressApiConfigType<Sockets = undefined> = OBACoreConfig & Partial<{
  vars:OBAExpressApiVars;
  middleware:OBAExpressApiMiddlewareConfig;
  sockets:OBAExpressApiSocketsConfig<Sockets>;
}>;
export type OBAExpressApiBaseTypeMethods = {
  monitor:() => Promise<any>;
  createApp:() => Promise<express.Application>;
  startDB:() => Promise<void>;
  startServer:() => Promise<void>;
  initCore:(startDb?:AnyBoolean) => Promise<void>;
  initServer:(startServer?:AnyBoolean) => Promise<void>;
  init:(db?:AnyBoolean,server?:AnyBoolean) => Promise<void>;
};
export type OBAExpressApiBaseType<Ev = undefined,Sockets = undefined> = Omit<OBACoreApi<Ev>,"config"> & OBAExpressApiBaseTypeMethods & {
  routes:RouterEndpoint[];
  config:OBAExpressApiConfigType<Sockets>;
  vars:OBAExpressApiVars;
  app:express.Express;
  server:HttpServer;
  io:SocketServer;
};