import express, { Router } from "express";
import { Keys, Enum } from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";
import { OBAExpressCommonMiddlewareConfig } from "./common-middleware-types";
import { CustomHandlers } from "./common-handler-types";
export declare type MainApiConstructor = (app: OBACore) => Promise<Router>;
export declare type OBAExpressMiddlewareConfig = {
    common: OBAExpressCommonMiddlewareConfig;
    custom?: CustomHandlers;
    main?: MainApiConstructor;
    auth?: Enum<string, "cookie" | "secret" | "ekey">;
    order: Keys<OBAExpressMiddlewareConfig["common"]> | `custom.${Keys<OBAExpressMiddlewareConfig["custom"]>}` | "main"[];
};
export declare type OBAExpressMiddlewareSetter<MiddlewareOpts> = (app: express.Application, opts?: MiddlewareOpts, api?: OBACore) => void;
export declare type OBAExpressMiddlewareSetters = {
    [k in Keys<OBAExpressCommonMiddlewareConfig>]: OBAExpressMiddlewareSetter<OBAExpressCommonMiddlewareConfig[k]>;
};
