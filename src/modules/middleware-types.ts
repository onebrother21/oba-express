import express from "express";
import {Keys,Enum} from "@onebro/oba-common";
import OBACoreApi from "@onebro/oba-core-api";
import {OBAExpressApiMiddlewareBaseConfig} from "./middleware-base-types";
import {CustomHandlers,MainApiConstructor} from "./middleware-handler-types";

export type OBAExpressApiMiddlewareCustom = {custom?:CustomHandlers;};
export type OBAExpressApiMiddlewareMain = {main?:MainApiConstructor;};
export type OBAExpressApiMiddlewareAuth = {auth?:Enum<string,"cookie"|"secret"|"ekey">;};
export type OBAExpressApiMiddlewareConfig =
OBAExpressApiMiddlewareBaseConfig &
OBAExpressApiMiddlewareMain &
OBAExpressApiMiddlewareCustom &
OBAExpressApiMiddlewareAuth;

export type OBAExpressApiMiddlewareKeys = Keys<OBAExpressApiMiddlewareConfig>;
export type OBAExpressApiMiddlewareOpts<k extends OBAExpressApiMiddlewareKeys> = OBAExpressApiMiddlewareConfig[k];
export type OBAExpressApiMiddlewareSetter<Middleware> = (app:express.Application,opts?:Middleware,api?:OBACoreApi) => void;
export type OBAExpressApiMiddlewareSetters = {
  [k in OBAExpressApiMiddlewareKeys]:OBAExpressApiMiddlewareSetter<OBAExpressApiMiddlewareOpts<k>>;
};