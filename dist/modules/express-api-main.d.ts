import { AnyBoolean } from "@onebro/oba-common";
import { OBAExpressApiConfig } from "./express-api-config-type";
import { OBAExpressApiBaseType } from "./express-api-base-type";
import { RouterEndpoint } from "./middleware-handler-types";
export interface OBAExpressApi<Ev, Sockets> extends OBAExpressApiBaseType<Ev, Sockets> {
}
export declare class OBAExpressApi<Ev, Sockets> {
    config: OBAExpressApiConfig<Ev, Sockets>;
    constructor(config: OBAExpressApiConfig<Ev, Sockets>);
    get routes(): RouterEndpoint[];
    startDB: () => Promise<void>;
    startServer: () => Promise<void>;
    createApp: () => Promise<import("express-serve-static-core").Express>;
    initCore: (start?: AnyBoolean) => Promise<void>;
    initServer: (start?: AnyBoolean) => Promise<void>;
    monitor: () => Promise<import("rxjs").Subscription>;
    init: (db?: AnyBoolean, server?: AnyBoolean) => Promise<void>;
}
export default OBAExpressApi;
