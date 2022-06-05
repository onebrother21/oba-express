import express from "express";
import {Server as HttpServer} from "http";
import {Server as SocketServer} from "socket.io";
import OBACore,{OBACoreConfig} from "@onebro/oba-core";
import {AnyBoolean} from "@onebro/oba-common";
import {OBAExpressVars} from "./vars";
import {OBAExpressMiddlewareConfig} from "./middleware";
import {OBAExpressSocketsConfig} from "./sockets";

export type OBAExpressRouterEndpoint = {path:string,methods:string[]};
export type OBAExpressConfigType<Sockets = undefined> = OBACoreConfig & Partial<{
  vars:OBAExpressVars;
  middleware:OBAExpressMiddlewareConfig;
  sockets:OBAExpressSocketsConfig<Sockets>;
}>;
export type OBAExpressMethods = {
  monitor:() => Promise<any>;
  createApp:(api:OBAExpressType<any,any>) => Promise<express.Express>;
  startDB:() => Promise<void>;
  startServer:() => Promise<void>;
  initCore:(startDb?:AnyBoolean) => Promise<void>;
  initServer:(startServer?:AnyBoolean) => Promise<void>;
  init:(db?:AnyBoolean,server?:AnyBoolean) => Promise<void>;
};
export type OBAExpressType<Ev = undefined,Sockets = undefined> = Omit<OBACore<Ev>,"config"> & OBAExpressMethods & {
  routes:OBAExpressRouterEndpoint[];
  config:OBAExpressConfigType<Sockets>;
  vars:OBAExpressVars;
  app:express.Express;
  server:HttpServer;
  io:SocketServer;
};