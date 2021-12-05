import { Component, AnyBoolean } from "@onebro/oba-common";
import { OBAExpressApiConfig } from "./express-api-config-type";
import { OBAExpressApiBaseType } from "./express-api-base-type";
import { RouterEndpoint } from "./middleware-handler-types";
export interface OBAExpressApi<Ev, Sockets> extends Component<OBAExpressApiConfig<Ev, Sockets>, Ev>, OBAExpressApiBaseType<Ev, Sockets> {
}
export declare class OBAExpressApi<Ev, Sockets> extends Component<OBAExpressApiConfig<Ev, Sockets>, Ev> {
    get e(): import("@onebro/oba-core-base-api").OBACoreBaseErrorFactory<Ev>;
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
