import path from "path";
import {expressConfig} from "../../src";
import {TestAppApi,DefaultSockets} from "./test-app-types";
import {getListeners} from "./test-app-events";
import {getMiddleware} from "./test-app-middleware";
import {getSockets} from "./test-app-sockets";
import OB from "@onebro/oba-common";

export const testAppApiConfig = async (s:string) => {
  try{
    const config = expressConfig<DefaultSockets>(s);
    const api = new TestAppApi(config);
    const dirname = path.join(__dirname,"/../../logs");
    const db = api.config.db.uri;
    //api.ctrl. = getListeners(api) as any;
    api.config.logger.file = api.config.logger.file.map((l:any) => ({...l,dirname}));
    api.config.logger.db = api.config.logger.db.map((l:any) => ({...l,db}));
    api.config.sockets = getSockets(s,api) as any;
    api.config.middleware = OB.mergeObj(api.config.middleware,getMiddleware(s,api),false) as any;
    return {api};
  }
  catch(e){OB.error(e);throw e;}
};