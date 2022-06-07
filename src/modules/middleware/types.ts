import express, { Router } from "express";
import {Keys,Enum} from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";
import {OBAExpressCommonMiddlewareConfig} from "./common-middleware-types";
import {CustomHandlers} from "./common-handler-types";

export type OBAExpressRouterConstructor = (app:OBACore) => Promise<Router>;
export type OBAExpressRouterEndpoint = {path:string,methods:string[]};
export type OBAExpressMiddlewareConfig = {
  common:OBAExpressCommonMiddlewareConfig;
  custom?:CustomHandlers;
  main?:OBAExpressRouterConstructor;
  auth?:Enum<string,"cookie"|"secret"|"ekey">;
  order:Keys<OBAExpressMiddlewareConfig["common"]>|`custom.${Keys<OBAExpressMiddlewareConfig["custom"]>}`|"main"[];
};
export type OBAExpressMiddlewareSetter<MiddlewareOpts> = (app:express.Application,opts?:MiddlewareOpts,api?:OBACore) => void;
export type OBAExpressMiddlewareSetters = {
  [k in Keys<OBAExpressCommonMiddlewareConfig>]:OBAExpressMiddlewareSetter<OBAExpressCommonMiddlewareConfig[k]>;
};