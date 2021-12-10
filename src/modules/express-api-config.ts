import config from "config";
import OB,{ DeepPartial } from "@onebro/oba-common";
import { coreConfig } from "@onebro/oba-core-api";
import { OBAExpressApiConfig } from "./express-api-config-type";

const setDefaultConfigWithEnvironment = <Ev,Sockets>(prefix:string):OBAExpressApiConfig<Ev,Sockets> => {
  const host = OB.evar(prefix,"_HOST");
  const port = Number(OB.evar(prefix,"_PORT"));
  const origins = OB.evar(prefix,"_ORIGINS")?OB.evar(prefix,"_ORIGINS").split(","):[];
  const providers = JSON.parse(OB.evar(prefix,"_PROVIDERS"));
  const consumers = JSON.parse(OB.evar(prefix,"_CONSUMERS"));
  const settings = {checkConn:false};
  const initial:OBAExpressApiConfig<Ev,Sockets> = config.get("appconfig");
  const coreRuntime = OB.mergeObj(initial,coreConfig(prefix));
  const atRuntime:DeepPartial<OBAExpressApiConfig<Ev,Sockets>> = {
    vars:{host,port,providers,consumers,settings},
    middleware:{cors:{origins}},
  };
  const expressConfig = OB.mergeObj(coreRuntime,atRuntime) as OBAExpressApiConfig<Ev,Sockets>;
  return expressConfig;
};
export {setDefaultConfigWithEnvironment as expressConfig};