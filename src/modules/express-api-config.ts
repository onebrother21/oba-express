import config from "config";
import deepmerge from "deepmerge";
import { DeepPartial } from "@onebro/oba-common";
import { coreConfig } from "@onebro/oba-core-api";
import { OBAExpressApiConfig } from "./express-api-main";
import { DefaultMainApp,DefaultCustomMiddlewares,DefaultSockets} from "./api-defaults";

const setDefaultConfigWithEnvironment = <EV>(envPrefix:string):OBAExpressApiConfig<EV> => {
  const prefix = envPrefix.toLocaleUpperCase();
  const getEnvVar = (s:string) => process.env[prefix + s];
  const env = process.env.NODE_ENV.toLocaleUpperCase();
  const host = getEnvVar("_HOST");
  const port = Number(getEnvVar("_PORT"));
  const origins = getEnvVar("_ORIGINS")?getEnvVar("_ORIGINS").split(","):[];
  const providers = JSON.parse(getEnvVar("_PROVIDERS"));
  const consumers = JSON.parse(getEnvVar("_CONSUMERS"));
  const settings = {checkConn:false};
  const initial:OBAExpressApiConfig<EV> = config.get("appconfig");
  const coreRuntime = coreConfig(envPrefix);
  const atRuntime:DeepPartial<OBAExpressApiConfig<EV>> = {
    ...coreRuntime,
    vars_app:{host,port,providers,consumers,settings},
    main:DefaultMainApp,
    middleware:{
      cors:{origins},
      session:{
        name:getEnvVar("_SESSION_ID"),
        secret:getEnvVar("_SESSION_SECRET"),
        store:{
          collectionName:`${envPrefix.toLocaleLowerCase()}sessions`,
          mongoUrl:coreRuntime.db.connections[prefix],
        }
      },
      main:{},
      custom:DefaultCustomMiddlewares,
    },
    sockets:{events:DefaultSockets},
  };
  const expressConfig = deepmerge(initial,atRuntime) as OBAExpressApiConfig<EV>;
  return expressConfig;
};
export {setDefaultConfigWithEnvironment as expressConfig};