import path from "path";
import {expressConfig} from "../../src";
import {TestAppApi,DefaultEvents,DefaultSockets} from "./test-app-types";
import {getListeners} from "./test-app-events";
import {getMiddleware} from "./test-app-middleware";
import {getSockets} from "./test-app-sockets";
import OBA from "@onebro/oba-common";

export const testAppApiConfig = async (s:string) => {
  try{
    const config = expressConfig<DefaultEvents,DefaultSockets>(s);
    const api = new TestAppApi(config);
    api.config.logger.dirname = path.join(__dirname,"/../../logs");
    api.config.events = getListeners(api) as any;
    api.config.sockets = getSockets(s,api) as any;
    api.config.middleware = OBA.merge(api.config.middleware,getMiddleware(s,api)) as any;
    return {api};
  }
  catch(e){console.error(e);throw e;}
};