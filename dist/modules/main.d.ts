import express from "express";
import { Component, AnyBoolean } from "@onebro/oba-common";
import { OBAExpressConfigType, OBAExpressBaseType, OBAExpressRouterEndpoint } from "./types";
export declare type OBAExpressConfig<Sockets> = OBAExpressConfigType<Sockets>;
export interface OBAExpress<Ev = undefined, Sockets = undefined> extends Component<OBAExpressConfig<Sockets>, Ev>, OBAExpressBaseType<Ev, Sockets> {
}
export declare class OBAExpress<Ev = undefined, Sockets = undefined> extends Component<OBAExpressConfig<Sockets>, Ev> {
    get e(): import("@onebro/oba-core").OBACoreErrorFactory;
    get v(): OBAExpress<Ev, Sockets>["vars"];
    set v(vars: OBAExpress<Ev, Sockets>["vars"]);
    get routes(): OBAExpressRouterEndpoint[];
    startServer: () => Promise<void>;
    createApp: (api: any) => Promise<express.Express>;
    initCore: (start?: AnyBoolean) => Promise<void>;
    initServer: (start?: AnyBoolean) => Promise<void>;
    monitor: () => Promise<import("rxjs").Subscription>;
    init: (db?: AnyBoolean, server?: AnyBoolean) => Promise<void>;
}
export default OBAExpress;
