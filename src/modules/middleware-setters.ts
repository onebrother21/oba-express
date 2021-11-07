import express,{Request,Response} from "express";
import compression from "compression";
import path from "path";
import morgan from "morgan";
import cors,{CorsOptions} from "cors";
import cookieParser from "cookie-parser";
import session,{SessionOptions} from "express-session";
import mongo from "connect-mongo";
import helmet from "helmet";
import csrf from "csurf";
import lusca from "lusca";
import flash from "express-flash";
import passport from "passport";
import errorhandler from "errorhandler";
import {Handler,ErrorHandler} from "./middleware-handler-types";
import {OBAExpressApiMiddlewareType} from "./middleware-types";
import {morganMsgFormats,morganMsgTokens,checkCORS} from "./middleware-utils";
import OBA,{Keys,AppError} from "@onebro/oba-common";

export const getMiddlewares = <Ev,Sockets>():OBAExpressApiMiddlewareType<Ev,Sockets> => ({
  disablePoweredBy:(a,o)  => {o?a.disable("x-powered-by"):null;},
  compression:(a,o) => {o?a.use(compression()):null;},
  flash:(a,o) => {o?a.use(flash()):null;},
  errorhandler:(a,o) => {o?a.use(errorhandler()):null;},
  morgan:(a,o,core) => {
    const {useDev,useLogger} = o;
    const {logger} = core;
    const formats = morganMsgFormats;
    for(const k in morganMsgTokens) morgan.token(k,morganMsgTokens[k]);
    if(useDev) a.use(morgan("dev"));
    if(useLogger && logger && logger.access){
      for(const k in formats){
        let o = {};
        switch(k){
          case "access":o = {stream:{write:logger.access.bind(logger)}};break;
          case "warn":o = {skip:(req:Request) => !req.warning,stream:{write:logger.warn.bind(logger)}};break;
          case "error":o = {skip:(req:Request) => !req.error,stream:{write:logger.error.bind(logger)}};break;
        }
        a.use(morgan(formats[k],o));
      }
    }
  },
  cors:(a,o,core) => {
    const {origins,preflightContinue,credentials} = o;
    const opts:CorsOptions = {
      preflightContinue,
      credentials,
      origin:(origin:string,done:Function) => {
        //const whitelist = [...origins,...core.vars.whitelist];
        checkCORS({origin,origins})?done():done(core.e.cors());
      }
    };
    a.use(cors(opts));
  },
  cookieParser:(a,o) => {a.use(cookieParser(o.secret));},
  bodyParser:(a,o) => {for(const k in o) a.use((<any>express)[k](o[k as Keys<typeof o>]));},
  session:(a,o) => {
    const store = o.store?mongo.create(o.store):null;
    const opts:SessionOptions = Object.assign(o,{store});
    a.use(session(opts));
  },
  csrf:(a,o) => {
    const handler:Handler = async (req,res,next) => {
      res.cookie("XSRF-TOKEN",req.csrfToken());
      return next();
    };
    a.use(csrf(o));
    a.use(handler);
  },
  lusca:(a,o) => {
    const csrfCookie = o.csrf && (<any>o.csrf).cookie?(<any>o.csrf).cookie:null;
    const cookieName = OBA.str(csrfCookie)?csrfCookie:csrfCookie.name;
    const handler:Handler = async (req,res,next) => {
      const csrf = req.cookies[cookieName];
      if(csrf) req.body && csrf?(req.body._csrf = csrf):null && OBA.trace({csrf});
      return next();};
    //OBA.trace({csrfCookie});
    csrfCookie?a.use(handler):null;
    a.use(lusca(o));
  },
  passport:(a) => {a.use(passport.initialize());},
  public:(a,o) => {
    const publicPath = path.join(o.dirname,"public");
    a.use(express.static(publicPath,o));
  },
  views:(a,o) => {
    a.set("views",path.join(o.dirname,"../views"));
    a.set("view engine",o.engine);
  },
  pageNotFound:(a,o,core) => {a.use(async (req,res,next) => next(core.e.notfound()));},
  finalHandler:(a,o,core) => {
    const handler:ErrorHandler = (e,req,res,next) => {
      let _e:AppError;
      switch(true){
        case e instanceof AppError:_e = e as AppError;break;
        case !!(e as Pick<AppError,"errors">).errors:_e = Object.assign(core.e.validation(),e);break;
        default: _e = core.e.map(<Error>e);break;
      }
      if(_e.status >= 500) OBA.traceError(_e);
      req.error = _e;
      if(res.headersSent){OBA.warn("response already sent",_e.message);return;}
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
});