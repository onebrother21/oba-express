import {Request} from "express";
import OB,{defaultLocals as locals,Enum} from "@onebro/oba-common";
import { ApiUserID } from "./vars-types";

export const morganMsgTokens:OB.TypedMethods<Request,string> = {
  errLogMsg:(req:Request) => {
    const msg = {
      id:!req.id?OB.longId():req.id,
      time:new Date().toLocaleString("en-US",locals.dateFormat as any),
      appName:req.appname,
      name:req.error?req.error.name:"",
      msg:req.error?req.error.message:"",
      warning:req.error&&req.error.warning?req.error.warning:false,
      code:req.error&&req.error.code?req.error.code.toString():"",
      info:req.error&&req.error.info?JSON.stringify(req.error.info):{},
      errors:req.error&&req.error.errors?JSON.stringify(req.error.errors):{},
      stack:req.error?req.error.stack:"",
    };
    return JSON.stringify(msg);
  },
  accessLogMsg:(req:Request) => {
    const msg = {
      time:new Date().toLocaleString("en-US",locals.dateFormat as any),
      hostname:req.hostname,
      appName:req.appname,
      contentType:req.headers["content-type"],
      headers:req.headers?JSON.stringify(req.headers):"",
      query:req.query?JSON.stringify(req.query):"",
      params:req.params?JSON.stringify(req.params):"",
      body:req.body?JSON.stringify(req.body):"",
    };
    return JSON.stringify(msg);
  },
};
//"ip"::remote-addr,
const defaultTknStr1 = `{"host":":req["hostname"]","user":":remote-user","referrer":":referrer","agent":":user-agent","http":":http-version",`;
const defaultTknStr2 = `"method":":method","path":":url","res-status"::status,"res-size"::res[content-length],"res-time"::response-time}`;
const defaultTknStr = defaultTknStr1 + defaultTknStr2;
const accessMsgStr = `:accessLogMsg`;
export const morganMsgFormats:Enum<string,undefined,"access"|"warn"|"error"|"info"> = {
  access:defaultTknStr,
  //warn:`:errLogMsg`,
  //error:`:errLogMsg`,
};

export type CheckCORS = Partial<{origin:string;origins:string[];whitelist:ApiUserID[];blacklist:ApiUserID[]}>;
export const checkCORS = ({origin,origins,whitelist,blacklist}:CheckCORS) => {
  if(!origin) return false;
  if(origins) for(let i = 0,l = origins.length;i<l;i++) if(OB.match(new RegExp(origins[i]),origin)) return true;
  if(whitelist) for(let i = 0,l = whitelist.length;i<l;i++) if(OB.match(new RegExp(whitelist[i].id),origin)) return true;
  if(blacklist) for(let i = 0,l = blacklist.length;i<l;i++) if(OB.match(new RegExp(blacklist[i].id),origin)) return false;
  return false;
};