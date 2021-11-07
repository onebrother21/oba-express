import OBA from "@onebro/oba-common";
import { OBAExpressApiConfig } from "./express-api-config-type";
declare const setDefaultConfigWithEnvironment: <Ev, Sockets>(prefix: string) => Partial<{
    vars: Record<"name" | "env" | "version", string> & Partial<Record<"id" | "tkn" | "mode", string>> & Record<undefined, boolean> & Partial<Record<"verbose", boolean>> & Record<"host" | "env" | "entry", string> & Partial<Record<undefined, string>> & Record<"port", number> & Partial<Record<undefined, number>> & Partial<{
        settings: import("./vars-types").ApiSettings;
        providers: OBA.Enum<import("./vars-types").ApiCredentials, undefined, undefined>;
        consumers: OBA.Enum<import("./vars-types").ApiCredentials, undefined, undefined>;
        whitelist: import("./vars-types").ApiUserID[];
        blacklist: import("./vars-types").ApiUserID[];
    }>;
    logger: import("@onebro/oba-core-api").WinstonLoggerConfig;
    errors: OBA.Errors;
    e: OBA.Errors;
    events: import("@onebro/oba-core-api").OBACoreEmitterConfig<Ev>;
    db: import("@onebro/oba-core-api").OBACoreDBConfig;
    middleware: import("./middleware-types").OBAExpressApiMiddlewareConfig<Ev, Sockets>;
    sockets: import("./sockets-types").OBAExpressApiSocketsConfig<Sockets>;
}>;
export { setDefaultConfigWithEnvironment as expressConfig };
