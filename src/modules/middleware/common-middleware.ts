import express,{Request,Response} from "express";
import compression from "compression";
import path from "path";
import morgan from "morgan";
import cors,{CorsOptions} from "cors";
import cookieParser from "cookie-parser";
import session,{SessionOptions} from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import csrf from "csurf";
import lusca from "lusca";
import flash from "express-flash";
import errorhandler from "errorhandler";
import * as uuid from "uuid";
const {v4:uuidv4} = uuid;
import {Handler,ErrorHandler} from "./common-handler-types";
import {
  MorganLoggerTypes,
  morganMsgFormats,
  morganMsgTokens,
  validateCORS,
} from "./common-middleware-utils";
import OB,{Keys,AppError} from "@onebro/oba-common";
import { OBAExpressMiddlewareSetters } from "./types";

export const CommonMiddleware:Partial<OBAExpressMiddlewareSetters> = {
  disablePoweredBy:(a,o)  => {o?a.disable("x-powered-by"):null;},
  compression:(a,o) => {o?a.use(compression()):null;},
  flash:(a,o) => {o?a.use(flash()):null;},
  errorhandler:(a,o) => {o?a.use(errorhandler()):null;},
  morgan:(a,o,api) => {
    const {useDev,useLogger} = o;
    const {logger} = api;
    for(const k in morganMsgTokens) morgan.token(k,morganMsgTokens[k]);
    if(useDev && !OB.isEnv("prod")) a.use(morgan("dev"));
    if(useLogger) for(const k in morganMsgFormats){
      const K = k as MorganLoggerTypes;
      const format = morganMsgFormats[K];
      const skip = (req:Request) =>  k == "error"?!req.error:k == "warn"?!req.warning:false;
      const stream = {write:logger.postLogMsg.bind(logger,K)};
      const opts = {skip,stream} as morgan.Options<any,any>;
      a.use(morgan(format,opts));
    }
  },
  cors:(a,o,api) => {
    const {whitelist,...corsOpts} = o;
    const opts:CorsOptions = {...corsOpts,origin:(origin,done) => {
      const allowed = validateCORS(origin,whitelist);
      return allowed?done(null,true):done(api.e._.cors(),false);
    }};
    a.use(cors(opts));
  },
  cookieParser:(a,o) => {a.use(cookieParser(o.secret));},
  bodyParser:(a,o) => {for(const k in o) a.use((<any>express)[k](o[k as Keys<typeof o>]));},
  session:(a,o) => {
    const store = o.store?MongoStore.create(o.store):null;
    const opts:SessionOptions = Object.assign(o,{store});
    //opts.genid = () => uuidv4();
    if(OB.isEnv("prod")) a.set("trust proxy",1);// trust first proxy
    a.use(session(opts));
  },
  csrf:(a,o) => {
    const csrfHandler:Handler = async (req,res,next) => {
      res.cookie("XSRF-TOKEN",req.csrfToken(),{
        httpOnly:true,
        secure:OB.isEnv("prod"),
        sameSite:OB.isEnv("prod")?"none":"lax"
      });
      return next();
    };
    a.use(csrf(o));
    a.use(csrfHandler);
  },
  lusca:(a,o) => {
    const csrfCookie = o.csrf && (<any>o.csrf).cookie?(<any>o.csrf).cookie:null;
    const cookieName = OB.str(csrfCookie)?csrfCookie:csrfCookie.name;
    const handler:Handler = async (req,res,next) => {
      const csrf = req.cookies[cookieName];
      if(csrf) req.body && csrf?(req.body._csrf = csrf):null && OB.trace({csrf});
      return next();
    };
    csrfCookie?a.use(handler):null;
    a.use(lusca(o));
  },
  useStatic:(a,o) => {o.dirname?a.use(express.static(o.dirname,o)):null;},
  useViews:(a,o) => {
    if(o.dirname && o.engine){
      a.set("views",o.dirname);
      a.set("view engine",o.engine);
    }
  },
  pageNotFound:(a,o,api) => {a.use(async (req,res,next) => next(api.e._.notfound()));},
  finalHandler:(a,o,api) => {
    const handler:ErrorHandler = (e,req,res,next) => {
      let _e:AppError;
      switch(true){
        case e instanceof AppError:_e = e as AppError;break;
        case !!(e as Pick<AppError,"errors">).errors:_e = Object.assign(api.e._.validation(),e);break;
        default:_e = api.e.map(<Error>e);break;
      }
      if(_e.warning){
        //OB.warn(_e);
        req.warning = _e;
      }
      else if(_e.status >= 500){
        req.error = _e;
      }
      //OB.error(_e);
      if(res.headersSent){OB.warn("response already sent",_e.message);return;}
      res.status(_e.status).json({
        name:_e.name,
        message:_e.message,
        errors:_e.errors,
        status:_e.status,
        code:_e.code,
        info:_e.info,
      });
    };
    a.use(handler);
  },
};
export default CommonMiddleware;