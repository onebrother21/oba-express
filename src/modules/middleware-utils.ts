import {Request} from "express";
import morgan from "morgan";
import OB,{Enum,Strings,TypedMethods} from "@onebro/oba-common";
import { ApiUserID } from "./vars-types";
import { OBACoreLogger } from "@onebro/oba-core-api";

export type MorganLoggerTypes = "access"|"warn"|"error"|"info";
export const morganMsgTokens:TypedMethods<Request,string> = {
  errLogMsg:(req:Request) => {
    const msg:any = {
      id:req.id,
      ts:new Date().toLocaleString("en-US",OB.locals.dateFormat as any),
      name:req.error?req.error.name:"",
      msg:req.error?req.error.message:"",
      stack:req.error?req.error.stack:"",
    };
    req.error&&req.error.warning?msg.warning = req.error.warning:null;
    req.error&&req.error.code?msg.code = req.error.code:null;
    req.error&&req.error.info?msg.info = req.error.info:null;
    req.error&&req.error.errors?msg.errors = req.error.errors:null;
    return JSON.stringify(msg);
  },
  time:() => new Date().toLocaleString("en-US",OB.locals.dateFormat as any),
  hostname:(req:Request) => req.hostname,
  contentType:(req:Request) => req.headers["content-type"],
  headers:(req:Request) => req.headers?JSON.stringify(req.headers):"",
  query:(req:Request) => req.query?JSON.stringify(req.query):"",
  params:(req:Request) => req.params?JSON.stringify(req.params):"",
  body:(req:Request) => req.body?JSON.stringify(req.body):"",
};
const accessTokenStrs:Strings = {
  time:`"ts":":time"`,
  host:`"host":":hostname"`,
  user:`"user":":remote-user"`,
  ip:`"ip":":remote-addr"`,
  referrer:`"referrer":":referrer"`,
  agent:`"agent":":user-agent"`,
  http:`"http":":http-version"`,
  method:`"method":":method"`,
  path:`"path":":url"`,
  resStatus:`"status"::status`,
  resSize:`"size"::res[content-length]`,
  resTime:`"time"::response-time`,
};
const accessLogMsg = "{" + Object.keys(accessTokenStrs).map(k => accessTokenStrs[k as any]).join(",") +"}";
export const morganMsgFormats:Enum<string,undefined,MorganLoggerTypes> = {
  access:accessLogMsg,
  warn:`:errLogMsg`,
  error:`:errLogMsg`,
};
export const morganMsgFormatFlags:Enum<string,MorganLoggerTypes> = {
  "access":"ACCESS",
  "warn":"WARN",
  "error":"ERROR",
  "info":"INFO",
};
export const makeMorganOpts = (logger:OBACoreLogger,k:MorganLoggerTypes):morgan.Options<any,any> => ({
  skip:(req:Request) =>  k == "error"?!req.error:k == "warn"?!req.warning:false,
  stream:{write:async (str:string) => {
    const {file:fileLogger,db:dbLogger,dbCustom} = logger;
    const c = dbCustom[k];
    const d = dbLogger.info;
    const f = fileLogger[k].bind(fileLogger);
    const flag = morganMsgFormatFlags[k] as any;
    const meta = JSON.parse(str);
    let info:any;
    try{info = await c(meta);}
    catch(e){
      OB.warn(e);
      try{
        await OB.sleep(5);
        info = await d(flag,{meta});
      }
      catch(e){
        OB.warn(e);
        try{info = f(str);}
        catch(e_){throw e_;}
      }
    }
  }}
});
export type CheckCORS = Partial<{origin:string;origins:string[];whitelist:ApiUserID[];blacklist:ApiUserID[]}>;
export const checkCORS = ({origin,origins,whitelist,blacklist}:CheckCORS) => {
  if(!origin) return false;
  if(origins) for(let i = 0,l = origins.length;i<l;i++) if(OB.match(new RegExp(origins[i]),origin)) return true;
  if(whitelist) for(let i = 0,l = whitelist.length;i<l;i++) if(OB.match(new RegExp(whitelist[i].id),origin)) return true;
  if(blacklist) for(let i = 0,l = blacklist.length;i<l;i++) if(OB.match(new RegExp(blacklist[i].id),origin)) return false;
  return false;
};