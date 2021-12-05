import { OBACoreConfig } from "@onebro/oba-core-api";
import { OBAExpressApiVars } from "./vars-types";
import { OBAExpressApiMiddlewareConfig } from "./middleware-types";
import { OBAExpressApiSocketsConfig } from "./sockets-main";
export declare type OBAExpressApiConfig<Ev, Sockets> = OBACoreConfig & Partial<{
    vars: OBAExpressApiVars;
    middleware: OBAExpressApiMiddlewareConfig<Ev, Sockets>;
    sockets: OBAExpressApiSocketsConfig<Sockets>;
}>;
