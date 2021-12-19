import { Component, AnyBoolean } from "@onebro/oba-common";
import { OBAExpressApiConfigType, OBAExpressApiBaseType } from "./express-api-types";
import { RouterEndpoint } from "./middleware-handler-types";
export declare type OBAExpressApiConfig<Sockets> = OBAExpressApiConfigType<Sockets>;
export interface OBAExpressApi<Ev = undefined, Sockets = undefined> extends Component<OBAExpressApiConfig<Sockets>, Ev>, OBAExpressApiBaseType<Ev, Sockets> {
}
export declare class OBAExpressApi<Ev = undefined, Sockets = undefined> extends Component<OBAExpressApiConfig<Sockets>, Ev> {
    get e(): import("@onebro/oba-core-api").OBACoreErrorFactory;
    get v(): OBAExpressApi<Ev, Sockets>["vars"];
    set v(vars: OBAExpressApi<Ev, Sockets>["vars"]);
    get routes(): RouterEndpoint[];
    startServer: () => Promise<void>;
    createApp: () => Promise<import("express-serve-static-core").Express>;
    initCore: (start?: AnyBoolean) => Promise<void>;
    initServer: (start?: AnyBoolean) => Promise<void>;
    monitor: () => Promise<import("rxjs").Subscription>;
    init: (db?: AnyBoolean, server?: AnyBoolean) => Promise<void>;
}
export default OBAExpressApi;
