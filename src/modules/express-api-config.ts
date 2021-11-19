import config from "config";
import OBA,{ DeepPartial } from "@onebro/oba-common";
import { coreConfig } from "@onebro/oba-core-api";
import { OBAExpressApiConfig } from "./express-api-config-type";

const setDefaultConfigWithEnvironment = <Ev,Sockets>(prefix:string):OBAExpressApiConfig<Ev,Sockets> => {
  const host = OBA.envvar(prefix,"_HOST");
  const port = Number(OBA.envvar(prefix,"_PORT"));
  const origins = OBA.envvar(prefix,"_ORIGINS")?OBA.envvar(prefix,"_ORIGINS").split(","):[];
  const providers = JSON.parse(OBA.envvar(prefix,"_PROVIDERS"));
  const consumers = JSON.parse(OBA.envvar(prefix,"_CONSUMERS"));
  const settings = {checkConn:false};
  const initial:OBAExpressApiConfig<Ev,Sockets> = config.get("appconfig");
  const coreRuntime = coreConfig<Ev>(prefix);
  const atRuntime:DeepPartial<OBAExpressApiConfig<Ev,Sockets>> = {
    ...coreRuntime as any,
    vars:{...coreRuntime.vars,host,port,providers,consumers,settings},
    middleware:{cors:{origins}},
  };
  const expressConfig = OBA.merge(initial,atRuntime) as OBAExpressApiConfig<Ev,Sockets>;
  return expressConfig;
};
export {setDefaultConfigWithEnvironment as expressConfig};