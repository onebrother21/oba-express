import express from "express";
import { Keys, Enum } from "@onebro/oba-common";
import { OBAExpressApiBaseType } from "./express-api-base-type";
import { OBAExpressApiMiddlewareBaseConfig } from "./middleware-base-types";
import { CustomHandlers, MainApiConstructor } from "./middleware-handler-types";
export declare type OBAExpressApiMiddlewareCustom<Ev, Sockets> = {
    custom?: CustomHandlers<Ev, Sockets>;
};
export declare type OBAExpressApiMiddlewareMain<Ev, Sockets> = {
    main?: MainApiConstructor<Ev, Sockets>;
};
export declare type OBAExpressApiMiddlewareAuth<Ev, Sockets> = {
    auth?: Enum<string, "cookie" | "secret" | "ekey">;
};
export declare type OBAExpressApiMiddlewareConfig<Ev, Sockets> = OBAExpressApiMiddlewareBaseConfig & OBAExpressApiMiddlewareMain<Ev, Sockets> & OBAExpressApiMiddlewareCustom<Ev, Sockets> & OBAExpressApiMiddlewareAuth<Ev, Sockets>;
export declare type OBAExpressApiMiddlewareKeys<Ev, Sockets> = Keys<OBAExpressApiMiddlewareConfig<Ev, Sockets>>;
export declare type OBAExpressApiMiddlewareOpts<Ev, Sockets, k extends OBAExpressApiMiddlewareKeys<Ev, Sockets>> = OBAExpressApiMiddlewareConfig<Ev, Sockets>[k];
export declare type OBAExpressApiMiddlewareSetter<Middleware, Ev, Sockets> = (app: express.Application, opts?: Middleware, api?: OBAExpressApiBaseType<Ev, Sockets>) => void;
export declare type OBAExpressApiMiddlewareSetters<Ev, Sockets> = {
    [k in OBAExpressApiMiddlewareKeys<Ev, Sockets>]: OBAExpressApiMiddlewareSetter<OBAExpressApiMiddlewareOpts<Ev, Sockets, k>, Ev, Sockets>;
};
export declare type OBAExpressApiMiddlewareType<Ev, Sockets> = Partial<OBAExpressApiMiddlewareSetters<Ev, Sockets>>;
