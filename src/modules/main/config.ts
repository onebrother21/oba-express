import config from "config";
import OB,{ DeepPartial } from "@onebro/oba-common";
import { coreConfig } from "@onebro/oba-core";
import { OBAExpressConfig } from "./main";

export const expressConfig = <Sockets = undefined>():OBAExpressConfig<Sockets> => {
  const initial:OBAExpressConfig<Sockets> = config.get("appconfig");
  const host = process.env.HOST || OB.appvar("_HOST");
  const port = Number(process.env.PORT || OB.appvar("_PORT"));
  const whitelist = OB.appvar("_ORIGINS");
  const providers = OB.appvar("_PROVIDERS");
  const consumers = OB.appvar("_CONSUMERS");
  const settings = {checkConn:false};
  const coreInitial = coreConfig();
  const coreRuntime = OB.mergeObj(initial,coreInitial,false) as any;
  const corsAllowedHeaders = coreRuntime.middleware.common.cors.allowedHeaders;
  const corsApiHeaders = OB.appvar("_CORS_ALLOWED_HEADERS");
  const allowedHeaders = [...corsAllowedHeaders,...corsApiHeaders];
  const atRuntime:DeepPartial<OBAExpressConfig<Sockets>> = {
    vars:{host,port,providers,consumers,settings},
    middleware:{common:{cors:{whitelist,allowedHeaders}}},
  };
  const expressconfig = OB.mergeObj(coreRuntime,atRuntime,false) as OBAExpressConfig<Sockets>;
  return expressconfig;
};