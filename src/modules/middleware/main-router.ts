import express from "express";
import OB,{Component,AnyBoolean,AppError} from "@onebro/oba-common";
import {
  OBAExpressMiddleware,
} from "./main";

export const createApp = async (api:any):Promise<express.Express> => {
  const app = express();
  const middleware = OBAExpressMiddleware.init();
  const {common,custom,main,order} = api.config.middleware||{};
  const noMiddleware = !common && !custom;
  const mainSetter = async () => {
    main?
    app.use(api.vars.entry,await main(api)):
    app.get(api.vars.entry,(req,res) => res.json({ready:true}));
  };
  if(noMiddleware) await mainSetter();
  else for(const k of order){
    switch(true){
      case k == "main":{await mainSetter();break;}
      case OB.match(/custom\./,k):{
        const name = k.split(".")[1];
        const setter = custom?(custom as any)[name]:null;
        setter?app.use(await setter.func(api)):null;
        break;
      }
      default:{
        const opts = common[k as any];
        const setter = (middleware as any)[k as any];
        setter && opts?setter(app,opts as any,api):null;
        break;
      }
    }
  }
  middleware.pageNotFound(app,null,api);
  middleware.finalHandler(app,null,api);
  return app;
};