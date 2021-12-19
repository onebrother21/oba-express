import path from "path";
import { CustomHandlers,SendReqOpts,sendreq } from "../../src";
import OB,{DeepPartial} from "@onebro/oba-common";
import {TestAppApiConfig,TestAppApi,} from "./test-app-types";
import TestAppMainApi from "./test-app-main-api";

export type TestAppApiHandlers = CustomHandlers;
export const TestHandlers:TestAppApiHandlers = {
  reqId:{
    active:true,
    before:"cors",
    func:async () => async (req,res,next) => {
      (req as any).id = OB.longId();
      return next();
    }
  },
  showOrigin:{
    active:false,
    before:"cors",
    func:async () => async (req,res,next) => {
      OB.log(req.headers["origin"]);
      return next();
    }
  },
  apiGuard:{
    active:true,
    after:"cors",
    func:async api => async (req,res,next) => {
      const consumers = (api.vars as any).consumers;
      if(consumers){
        const name = req.url.split("/").slice(1)[0];
        const consumer = consumers[name];
        if(consumer){
          const id = req.headers["oba-client-id"] as string||"";
          const key = req.headers["oba-client-key"] as string||"";
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
    active:true,
    after:"session",
    func:async api => async (req,res,next) => {
      const {ip,session} = req as any;
      if(session && !session.ipdata){
        const provider = (api.vars as any).providers["ip-data"];
        const isLocal = /127.0.0/.test(ip);
        const url = isLocal?"":`https://consumer.ipdata.co${ip?"/"+ip:""}?consumer-key=${provider.key}`;
        const opts:SendReqOpts = {url,method:"get",body:""};
        const ipdata = isLocal?{addr:ip}:await sendreq(opts) as any;
        session.ipdata = ipdata;
        req.session = session;
      }
      return next();
    },
  },
  reqCounter:{
    active:true,
    after:"session",
    func:async () => async (req,res,next) => {
      const {session} = req as any;
      const within1Min = session.lastReq?((Date.now() - session.lastReq)/1000) <= 60:true;
      if(within1Min) session.visits = (session.visits||0)+1;
      else session.visits = 1;
      session.reqsPerMin = (session.visits/60);
      session.lastReq = Date.now();
      if(session.visits > 12) console.warn("whoa what is going on?");
      req.session = session;
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
    ekey:OB.evar(s,"_EKEY"),
    cookie:OB.evar(s,"_AUTH_COOKIE"),
    secret:OB.evar(s,"_AUTH_SECRET"),
  },
  session:{
    name:OB.evar(s,"_SESSION_ID"),
    secret:OB.evar(s,"_SESSION_SECRET"),
    store:{
      collectionName:`user_sessions`,
      mongoUrl:api.config.db.uri,
    }
  },
  custom:TestHandlers,
  main:TestAppMainApi,
});