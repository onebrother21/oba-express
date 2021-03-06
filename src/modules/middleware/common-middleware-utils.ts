import {Request} from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import OB,{Enum,Strings,TypedMethods} from "@onebro/oba-common";
import { OBACoreLogger } from "@onebro/oba-core";
import { CorsValidationParams } from "./common-middleware-types";
import { ApiUserID } from "../vars";

export type MorganLoggerTypes = "access"|"warn"|"error"|"info";
export const morganMsgTokens:TypedMethods<Request,string> = {
  errLogMsg:(req:Request) => {
    const msg:any = {
      id:req.id,
      //ts:new Date().toLocaleString("en-US",OB.locals.dateFormat as any),
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
  appuser:(req:Request) => (((req as any).appuser)||{}).username,
  hostname:(req:Request) => req.headers["host"] || req.hostname,
  reqid:(req:Request) => req.id||"",
  contentType:(req:Request) => req.headers["content-type"],
  headers:(req:Request) => req.headers?JSON.stringify(req.headers):"",
  query:(req:Request) => req.query?JSON.stringify(req.query):"",
  params:(req:Request) => req.params?JSON.stringify(req.params):"",
  body:(req:Request) => req.body?JSON.stringify(req.body):"",
};
const accessTokenStrs:Strings = {
  id:`"id":":reqid"`,
  host:`"host":":hostname"`,
  ip:`"ip":":remote-addr"`,
  user:`"user":":appuser"`,
  referrer:`"referrer":":referrer"`,
  agent:`"agent":":user-agent"`,
  http:`"http":":http-version"`,
  method:`"method":":method"`,
  path:`"url":":url"`,
  resStatus:`"status"::status`,
  resSize:`"res-size":":res[content-length]"`,
  resTime:`"res-time"::response-time`,
};
const accessLogMsg = "{" + Object.keys(accessTokenStrs).map(k => accessTokenStrs[k as any]).join(",") +"}";
export const morganMsgFormats:Enum<string,undefined,MorganLoggerTypes> = {
  access:accessLogMsg,
  warn:`:errLogMsg`,
  error:`:errLogMsg`,
};
export const validateCORS = ({origin,origins,blacklist}:CorsValidationParams) => {
  // allow requests with no origin, like mobile apps or curl requests? -> NO UNTIL FURTHER GUIDANCE
  if(!origin) return false;
  if(origins) for(let i = 0,l = origins.length;i<l;i++) if(OB.match(new RegExp(origins[i]),origin)) return true;
  /*
  if(blacklist) for(let i = 0,l = blacklist.length;i<l;i++) if(OB.match(new RegExp(OB.str(
    blacklist[i])?blacklist[i]:(blacklist[i] as any).id),origin)) return false;
  */
  return false;
};
export const readCert = () => {
  const certFile = path.resolve(__dirname, "ssl/client.crt");
  const keyFile = path.resolve(__dirname, "ssl/client.key");
  const caFile = path.resolve(__dirname, "ssl/ca.cert.pem");
  const SSLCertInfo = {
    cert:fs.readFileSync(certFile),
    key:fs.readFileSync(keyFile),
    passphrase:"password",
    ca:fs.readFileSync(caFile)
  };
  return SSLCertInfo;
};