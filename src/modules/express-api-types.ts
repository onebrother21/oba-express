import express from "express";
import {Server} from "http";
import {OBACoreConfig,OBACoreApi} from "@onebro/oba-core-api";
import {OptionalEnum,Strings,MiscInfo,DataMap} from "@onebro/oba-common";
import {OBAExpressApiMiddlewareConfig,OBAExpressApiRouterConstructor,OBAExpressApiRouter} from "./middleware-main";
import {OBAExpressApiSocketsConfig,OBAExpressApiSockets} from "./sockets-main";


export type OBAExpressApiIdentifier = OptionalEnum<string,"ip","username"|"loc">;
export type OBAExpressApiCredentials = OptionalEnum<string,"id"|"key"> & {data:Strings;};
export type OBAExpressApiSettings = {checkConn?:boolean|number;requireKey?:boolean;} & MiscInfo;
export type OBAExpressApiVarsBase = OptionalEnum<string,"host"|"env"|"entry"> & OptionalEnum<number,"port">;
export type OBAExpressApiVars =  OBAExpressApiVarsBase & {
  settings:OBAExpressApiSettings;
  providers:DataMap<OBAExpressApiCredentials>;
  consumers:DataMap<OBAExpressApiCredentials>;
  whitelist:OBAExpressApiIdentifier[];
  blacklist:OBAExpressApiIdentifier[];
};

export type OBAExpressApiConfig<EV> = OBACoreConfig & Partial<{
  vars_app:OBAExpressApiVars;
  middleware:OBAExpressApiMiddlewareConfig<EV>;
  main:OBAExpressApiRouterConstructor<EV>;
  sockets:OBAExpressApiSocketsConfig;
}>;
export type OBAExpressApiType<EV> = OBACoreApi<EV> & {
  config_app:OBAExpressApiConfig<EV>;
  vars_app:OBAExpressApiVars;
  app:OBAExpressApiRouter;
  server:Server;
  io:OBAExpressApiSockets;
}