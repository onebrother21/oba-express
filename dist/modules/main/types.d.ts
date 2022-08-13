/// <reference types="node" />
import express from "express";
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import OBACore, { OBACoreConfig } from "@onebro/oba-core";
import { AnyBoolean } from "@onebro/oba-common";
import { OBAExpressVars } from "../vars";
import { OBAExpressMiddlewareConfig, OBAExpressRouterEndpoint } from "../middleware";
import { OBAExpressSocketsConfig } from "../sockets";
export declare type OBAExpressConfigType<Sockets = undefined> = OBACoreConfig & Partial<{
    vars: OBAExpressVars;
    middleware: OBAExpressMiddlewareConfig;
    sockets: OBAExpressSocketsConfig<Sockets>;
}>;
export declare type OBAExpressMethods<E, S> = {
    createApp: (api: OBAExpressType<E, S>) => Promise<express.Express>;
    initCore: (startDb?: AnyBoolean) => Promise<void>;
    initServer: (startServer?: AnyBoolean) => Promise<void>;
    init: (db?: AnyBoolean, server?: AnyBoolean) => Promise<void>;
    startDB: () => Promise<void>;
    startServer: () => Promise<void>;
    monitorServer: () => Promise<any>;
};
export declare type OBAExpressBase<E> = Omit<OBACore<E>, "config">;
export declare type OBAExpressType<Ev = undefined, Sockets = undefined> = OBAExpressBase<Ev> & OBAExpressMethods<Ev, Sockets> & {
    config: OBAExpressConfigType<Sockets>;
    routes: OBAExpressRouterEndpoint[];
    vars: OBAExpressVars;
    app: express.Express;
    server: HttpServer;
    io: SocketServer;
};
