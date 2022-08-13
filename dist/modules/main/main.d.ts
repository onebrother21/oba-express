import express from "express";
import { Component, AnyBoolean } from "@onebro/oba-common";
import { OBAExpressConfigType, OBAExpressType } from "./types";
import { OBAExpressRouterEndpoint } from "../middleware";
export declare type OBAExpressConfig<Sockets> = OBAExpressConfigType<Sockets>;
export interface OBAExpress<Ev = undefined, Sockets = undefined> extends Component<OBAExpressConfig<Sockets>, Ev>, OBAExpressType<Ev, Sockets> {
}
export declare class OBAExpress<Ev = undefined, Sockets = undefined> extends Component<OBAExpressConfig<Sockets>, Ev> {
    get e(): import("@onebro/oba-core").OBACoreErrorFactory;
    get v(): OBAExpress<Ev, Sockets>["vars"];
    set v(vars: OBAExpress<Ev, Sockets>["vars"]);
    get routes(): OBAExpressRouterEndpoint[];
    createApp: (api: OBAExpressType<undefined, undefined>) => Promise<express.Express>;
    init: (db?: AnyBoolean, server?: AnyBoolean) => Promise<void>;
    initCore: (start?: AnyBoolean) => Promise<void>;
    initServer: (start?: AnyBoolean) => Promise<void>;
    startServer: () => Promise<void>;
    monitorServer: () => Promise<import("rxjs").Subscription>;
}
export default OBAExpress;
