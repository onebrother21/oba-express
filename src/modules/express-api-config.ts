import config from "config";
import OB,{ DeepPartial } from "@onebro/oba-common";
import { coreConfig } from "@onebro/oba-core-api";
import { OBAExpressApiConfig } from "./express-api-main";

const setDefaultConfigWithEnvironment = <Sockets = undefined>(prefix:string):OBAExpressApiConfig<Sockets> => {
  const host = process.env.HOST || OB.getvar(prefix,"_HOST");
  const port = Number(process.env.PORT || OB.getvar(prefix,"_PORT"));
  //OB.log(host,port);
  const origins = OB.getvar(prefix,"_ORIGINS")?OB.getvar(prefix,"_ORIGINS").split(","):[];
  const providers = JSON.parse(OB.getvar(prefix,"_PROVIDERS"));
  const consumers = JSON.parse(OB.getvar(prefix,"_CONSUMERS"));
  const settings = {checkConn:false};
  const initial:OBAExpressApiConfig<Sockets> = config.get("appconfig");
  const coreRuntime = OB.mergeObj(initial,coreConfig(prefix),false);
  const atRuntime:DeepPartial<OBAExpressApiConfig<Sockets>> = {
    vars:{host,port,providers,consumers,settings},
    middleware:{cors:{origins}},
  };
  const expressConfig = OB.mergeObj(coreRuntime,atRuntime,false) as OBAExpressApiConfig<Sockets>;
  return expressConfig;
};
export {setDefaultConfigWithEnvironment as expressConfig};