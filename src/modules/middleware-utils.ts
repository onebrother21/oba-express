import {Request,Response} from "express";
import {appLocals as locals} from "@onebro/oba-common";
import * as ob from "@onebro/oba-common";

export const morganMsgTokens:ob.TypedMethods<Request,string> = {
  id:(req:Request) => {if(!req.id) req.id = ob.longId();return req.id;},
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
  errWarning:(req:Request) => (req.error&&req.error.warning).toString(),
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
  agent:":user-agent",
  http::http-version,
  method::method,
  path:":url",
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
export const morganMsgFormats:ob.Strings = {access:accessMsgStr,warn:errorMsgStr,error:errorMsgStr};
export const getAuthTknFromHeader = (req:Request) => {
  const header = req.headers["authorization"];
  const hasTkn = header && header.split(" ")[0] == "Token";
  return hasTkn?header.split(" ")[1]:null;};
export const checkWhitelist = (origin:string,whitelist:string[]) => {
  const l = whitelist.length;
  if(!l) return true;
  else if(!origin) return false;
  else{
    for(let i=0;i<l;i++){if(ob.match(new RegExp(whitelist[i]),origin)){return true;}}
    return false;
  }
};