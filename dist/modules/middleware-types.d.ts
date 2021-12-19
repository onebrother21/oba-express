import express from "express";
import { Keys, Enum } from "@onebro/oba-common";
import OBACoreApi from "@onebro/oba-core-api";
import { OBAExpressApiMiddlewareBaseConfig } from "./middleware-base-types";
import { CustomHandlers, MainApiConstructor } from "./middleware-handler-types";
export declare type OBAExpressApiMiddlewareCustom = {
    custom?: CustomHandlers;
};
export declare type OBAExpressApiMiddlewareMain = {
    main?: MainApiConstructor;
};
export declare type OBAExpressApiMiddlewareAuth = {
    auth?: Enum<string, "cookie" | "secret" | "ekey">;
};
export declare type OBAExpressApiMiddlewareConfig = OBAExpressApiMiddlewareBaseConfig & OBAExpressApiMiddlewareMain & OBAExpressApiMiddlewareCustom & OBAExpressApiMiddlewareAuth;
export declare type OBAExpressApiMiddlewareKeys = Keys<OBAExpressApiMiddlewareConfig>;
export declare type OBAExpressApiMiddlewareOpts<k extends OBAExpressApiMiddlewareKeys> = OBAExpressApiMiddlewareConfig[k];
export declare type OBAExpressApiMiddlewareSetter<Middleware> = (app: express.Application, opts?: Middleware, api?: OBACoreApi) => void;
export declare type OBAExpressApiMiddlewareSetters = {
    [k in OBAExpressApiMiddlewareKeys]: OBAExpressApiMiddlewareSetter<OBAExpressApiMiddlewareOpts<k>>;
};
