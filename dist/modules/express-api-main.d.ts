import { AnyBoolean } from "@onebro/oba-common";
import { OBAExpressApiConfig } from "./express-api-config-type";
import { OBAExpressApiBaseType } from "./express-api-base-type";
import { RouterEndpoint } from "./middleware-handler-types";
export interface OBAExpressApi<Ev, Sockets> extends OBAExpressApiBaseType<Ev, Sockets> {
}
export declare class OBAExpressApi<Ev, Sockets> {
    config: OBAExpressApiConfig<Ev, Sockets>;
    constructor(config: OBAExpressApiConfig<Ev, Sockets>);
    init: () => Promise<void>;
    createRouter: () => Promise<import("express-serve-static-core").Express>;
    get routes(): RouterEndpoint[];
    start: (db?: AnyBoolean, server?: AnyBoolean) => Promise<void>;
    private startDb;
    private startServer;
    monitor(): Promise<import("rxjs").Subscription>;
}
export default OBAExpressApi;
