import {Request} from "express";
import OBA,{Strings,appLocals as locals} from "@onebro/oba-common";
import { ApiUserID } from "./vars-types";

export const morganMsgTokens:OBA.TypedMethods<Request,string> = {
  id:(req:Request) => !req.id?OBA.longId():req.id,
  timestamp:() => new Date().toLocaleString("en-US",locals.dateFormat as any),
  hostname:(req:Request) => req.hostname,
  appName:(req:Request) => req.appname,
  contentType:(req:Request) => req.headers["content-type"],
  headers:(req:Request) => req.headers?JSON.stringify(req.headers):"",
  query:(req:Request) => req.query?JSON.stringify(req.query):"",
  params:(req:Request) => req.params?JSON.stringify(req.params):"",
  body:(req:Request) => req.body?JSON.stringify(req.body):"",
  errName:(req:Request) => req.error?req.error.name:"",
  errMsg:(req:Request) => req.error?req.error.message:"",
  errWarning:(req:Request) => req.error&&req.error.warning?req.error.warning.toString():"",
  errCode:(req:Request) => req.error&&req.error.code?req.error.code.toString():"",
  errInfo:(req:Request) => req.error&&req.error.info?JSON.stringify(req.error.info):"",
  errErrors:(req:Request) => req.error&&req.error.errors?JSON.stringify(req.error.errors):"",
  errStack:(req:Request) => req.error?req.error.stack:"",};
const accessMsgStr = `{
  reqId::id,
  time:":timestamp",
  hostname:":hostname",
  appname:":appName",
  user::remote-user,
  ip::remote-addr,
  referrer::referrer,
  agent::user-agent,
  http::http-version,
  method::method,
  path::url,
  res-status::status,
  res-size::res[content-length],
  res-time::response-time}`;
const errorMsgStr = `{
  reqId::id,
  time:":timestamp",
  name::errName,
  message:":errMsg",
  warning::errWarning,
  status::status,
  code::errCode,
  info:":errInfo",
  errors:":errErrors",
  stack::errStack,}`;
export const morganMsgFormats:Strings = {access:accessMsgStr,warn:errorMsgStr,error:errorMsgStr};

export type CheckCORS = Partial<{origin:string;origins:string[];whitelist:ApiUserID[];blacklist:ApiUserID[]}>;
export const checkCORS = ({origin,origins,whitelist,blacklist}:CheckCORS) => {
  if(!origin) return false;
  if(origins) for(let i = 0,l = origins.length;i<l;i++) if(OBA.match(new RegExp(origins[i]),origin)) return true;
  if(whitelist) for(let i = 0,l = whitelist.length;i<l;i++) if(OBA.match(new RegExp(whitelist[i].id),origin)) return true;
  if(blacklist) for(let i = 0,l = blacklist.length;i<l;i++) if(OBA.match(new RegExp(blacklist[i].id),origin)) return false;
  return false;
};