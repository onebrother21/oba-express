/// <reference types="node" />
import express from "express";
import { Server } from "http";
import OBACoreApi from "@onebro/oba-core-api";
import { OBAExpressApiVars } from "./vars-types";
import { OBAExpressApiSockets } from "./sockets-main";
import { OBAExpressApiConfig } from "./express-api-config-type";
import { RouterEndpoint } from "./middleware-handler-types";
import { AnyBoolean } from "@onebro/oba-common";
export declare type OBAExpressApiBaseTypeMethods = {
    monitor: () => Promise<any>;
    createApp: () => Promise<express.Application>;
    startDB: () => Promise<void>;
    startServer: () => Promise<void>;
    initCore: (startDb?: AnyBoolean) => Promise<void>;
    initServer: (startServer?: AnyBoolean) => Promise<void>;
    init: (db?: AnyBoolean, server?: AnyBoolean) => Promise<void>;
};
export declare type OBAExpressApiBaseType<Ev, Sockets> = Omit<OBACoreApi<Ev>, "config"> & OBAExpressApiBaseTypeMethods & {
    routes: RouterEndpoint[];
    config: OBAExpressApiConfig<Ev, Sockets>;
    vars: OBAExpressApiVars;
    app: express.Express;
    server: Server;
    io: OBAExpressApiSockets<Sockets>;
};
