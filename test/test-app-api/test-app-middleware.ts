import path from "path";
//import { SendReqOpts,sendreq } from "../middleware-utils";
import OB,{DeepPartial, longId} from "@onebro/oba-common";
import {
  TestAppApiConfig,
  TestAppApiHandlers,
  TestAppApi,
} from "./test-app-types";
import {TestAppMainApi} from "./test-app-main-api";

export const TestMiddlewares:TestAppApiHandlers = {
  reqId:{
    active:true,
    before:"cors",
    func:async () => async (req,res,next) => {
      (req as any).id = longId();
      return next();
    }
  },
  showOrigin:{
    active:false,
    before:"cors",
    func:async () => async (req,res,next) => {
      OB.here("l",req.headers["origin"]);
      return next();
    }
  },
  apiGuard:{
    active:true,
    after:"cors",
    func:async api => async (req,res,next) => {
      const consumers = api.vars.consumers;
      if(consumers){
        const name = req.url.split("/").slice(1)[0];
        const consumer = consumers[name];
        if(consumer){
          const id = req.headers["oba-client-id"] as string||null;
          const key = req.headers["oba-client-key"] as string||null;
          const valid = consumer && id && key?id === consumer.id && key === consumer.key:false;
          //ob.log(name,consumer,id,key,valid);
          if(!(id && key)) return next(api.e._.missing(401,"API credentials not provided"));
          if(!valid) return next(api.e._.invalid(401,"API credentials invalid"));
        }
      }
      return next();
    }
  },
  appShake:{
    active:true,
    after:"session",
    func:async () => async (req,res,next) => {
      switch(true){
        case req.cookies._caOB:{
          let randomNumber = Math.random().toString();
          randomNumber = randomNumber.substring(2,randomNumber.length);
          res.cookie("_baOB",randomNumber,{maxAge:900000,httpOnly:true});
          break;
        }
        case req.cookies._aB:{
          let randomNumber = Math.random().toString();
          randomNumber = randomNumber.substring(2,randomNumber.length);
          res.cookie("_bcOB",randomNumber,{maxAge:900000,httpOnly:true});
          break;
        }
        default:{
          let randomNumber = Math.random().toString();
          randomNumber = randomNumber.substring(2,randomNumber.length);
          res.cookie("_bc_0",randomNumber,{maxAge:900000,httpOnly:true});
          break;
        }
      }
      return next();
    },
  },
  ipData:{
    active:false,
    after:"session",
    func:async api => async (req,res,next) => {
      const session = req.session as any;
      if(session && !session.ipdata){
        const consumerkey = api.vars.providers["ip-data"];
        const ip = /127.0.0/.test(req.ip)?"":req.ip;
        const url = `https://consumer.ipdata.co${ip?"/"+ip:""}?consumer-key=${consumerkey}`;
        //const opts:SendReqOpts = {url};
        //req.session.ipdata = await sendreq(opts);
        req.session = session as any;
      }
      return next();
    },
  },
  reqCounter:{
    active:false,
    after:"session",
    func:async () => async (req,res,next) => {
      const session = req.session as any;
      const within1Min = session.lastReq?((Date.now() - session.lastReq)/1000) <= 60:true;
      if(within1Min) session.visits = (session.visits||0)+1;
      else session.visits = 1;
        //req.session.reqsPerMin = (req.session.visits/60);}
      //if(req.session.visits > 12) console.warn("whoa what is going on?");
      session.lastReq = Date.now();
      req.session = session as any;
      return next();
    }
  },
  addUserToLocals:{
    active:false,
    after:"session",
    func:async () => async (req,res,next) => {
      res.locals.user = (req as any).appuser;
      return next();
    },
  },
};
export const getMiddleware = (s:string,api:TestAppApi):DeepPartial<TestAppApiConfig["middleware"]> => ({
  //public:{dirname:path.join(__dirname,"/../../public")},
  //views:{dirname:path.join(__dirname,"/../../views")},
  auth:{
    ekey:OB.envvar(s,"_EKEY"),
    cookie:OB.envvar(s,"_AUTH_COOKIE"),
    secret:OB.envvar(s,"_AUTH_SECRET"),
  },
  session:{
    name:OB.envvar(s,"_SESSION_ID"),
    secret:OB.envvar(s,"_SESSION_SECRET"),
    store:{
      collectionName:`${s.toLocaleLowerCase()}sessions`,
      mongoUrl:api.config.db.connections[api.config.vars.name],
    }
  },
  custom:TestMiddlewares,
  main:TestAppMainApi,
});