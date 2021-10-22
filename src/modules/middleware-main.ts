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
import {Handler,ErrorHandler} from "./express-handler-types";
import {OBAExpressApiMiddlewareType} from "./middleware-types";
import {morganMsgFormats,morganMsgTokens,checkWhitelist} from "./middleware-utils";
import * as ob from "@onebro/oba-common";

export interface OBAExpressApiMiddleware<EV> extends OBAExpressApiMiddlewareType<EV> {} 
export class OBAExpressApiMiddleware<EV> {
  constructor(){
    this.public = (a,o) => {
      const publicPath = path.join(o.dirname,"public");
      a.use(express.static(publicPath,o));
    };
    this.views = (a,o) => {
      a.set("views",path.join(o.dirname,"../views"));
      a.set("view engine",o.engine);
    };
    this.compression = (a) => {a.use(compression());};
    this.morgan = (a,o,m) => {
      const {useDev,useLogger} = o;
      const {logger} = m;
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
    };
    this.cors = (a,o,m) => {
      const {origins,preflightContinue,credentials} = o;
      const opts:CorsOptions = {
        preflightContinue,
        credentials,
        origin:(origin:string,done:Function) => {
          //const whitelist = [...origins,...m.vars.whitelist];
          return checkWhitelist(origin,origins)?
          done():done(m.e.cors());
        }
      };
      a.use(cors(opts));
    };
    this.cookieParser = (a,o) => {a.use(cookieParser(o.secret));};
    this.bodyParser = (a,o) => {
      const {json,urlencoded,raw} = o;
      if(json) a.use(express.json(json));
      if(urlencoded) a.use(express.urlencoded(urlencoded));
      if(raw) a.use(express.raw(raw));
    };
    this.session = (a,o) => {
      const mongoStore = o.store?{store:mongo.create(o.store)}:null;
      const opts:SessionOptions = Object.assign({},o,mongoStore);
      a.use(session(opts));
    };
    this.lusca = (a,o) => {
      const csrfCookie = o.csrf&&(<any>o.csrf).cookie?(<any>o.csrf).cookie:null;
      const cookieName = ob.str(csrfCookie)?csrfCookie:csrfCookie.name;
      const handler:Handler = async (req,res,next) => {
        const csrf = req.cookies[cookieName];
        if(csrf) req.body && csrf?(req.body._csrf = csrf):null && ob.trace({csrf});
        return next();};
      //ob.trace({csrfCookie});
      csrfCookie?a.use(handler):null;
      a.use(lusca(o));
    };
    this.csrf = (a,o) => {
      const handler:Handler = async (req,res,next) => {
        res.cookie("XSRF-TOKEN",req.csrfToken());
        return next();};
      a.use(csrf(o));
      a.use(handler);
    };
    this.flash = (a) => {a.use(flash());};
    this.errorhandler = (a) => {a.use(errorhandler());};
    this.passport = (a) => {a.use(passport.initialize());};
    this.pageNotFound = (a,o,m) => {a.use(async (req,res,next) => next(m.e.notfound()));};
    this.finalHandler = (a,o,m) => {
      const handler:ErrorHandler = (e,req,res,next) => {
        let _e:ob.AppError;
        switch(true){
          case e instanceof ob.AppError:_e = e as ob.AppError;break;
          case !!(e as ob.ValidationErrors).errors:_e = Object.assign(m.e.validation(),e);break;
          default: _e = m.e.map(<Error>e);break;
        }
        if(_e.status >= 500) ob.traceError(_e);
        req.error = _e;
        if(res.headersSent){ob.warn("response already sent",_e.message);return;}
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
    };
  }
}
export default OBAExpressApiMiddleware;
export * from "./middleware-types";