import express from "express";
import {Keys,Enum} from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";
import {OBAExpressMiddlewareBaseConfig} from "./common-middleware-types";
import {CustomHandlers} from "./common-handler-types";
import {MainApiConstructor} from "./main-router-types";

export type OBAExpressMiddlewareConfig = {
  common:OBAExpressMiddlewareBaseConfig;
  custom?:CustomHandlers;
  main?:MainApiConstructor;
  auth?:Enum<string,"cookie"|"secret"|"ekey">;
  order:Keys<OBAExpressMiddlewareConfig["common"]>|`custom.${Keys<OBAExpressMiddlewareConfig["custom"]>}`|"main"[];
};
export type OBAExpressMiddlewareSetter<MiddlewareOpts> = (app:express.Application,opts?:MiddlewareOpts,api?:OBACore) => void;
export type OBAExpressMiddlewareSetters = {
  [k in Keys<OBAExpressMiddlewareBaseConfig>]:OBAExpressMiddlewareSetter<OBAExpressMiddlewareBaseConfig[k]>;
};