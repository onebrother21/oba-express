import { Request } from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import {ValidationChain,validationResult} from "express-validator";
import OB,{Keys,Values,Strings,AppError,AnyBoolean,Enum} from "@onebro/oba-common";
import {Handler,SendReqOpts} from "./middleware-handler-types";

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
export const generateTkn = (payload:any,secret:string,opts?:any) => jwt.sign(payload,secret,opts);
export const verifyTkn = (header:string,secret:string) => {
  if(!header) return null;
  const parts = header.split(" ");
  const valid = ["Bearer","Token"].includes(parts[0]) && !!parts[1];
  const token = valid?parts[1]:null;
  if(!token) return null;
  return jwt.verify(token,secret);
};
export const getApiUserCreds = (cookieName:string,ekey:string,authSecret:string) => {
  const handler:Handler = async (req,res,next) => {
    const cookie = req.cookies[cookieName]  as string;
    req.appuser = cookie?OB.decrypt(ekey,cookie):null;
    req.authtkn = verifyTkn(req.headers.authorization,authSecret);
    return next();};
  return handler;
};
export const validateApiUserCreds = () => {
  const handler:Handler = async (req,res,next) => req.authtkn?next():next(new AppError({
    message:"Not Authorized",
    status:401
  }));
  return handler;
};
export const handleReqValidation = (validators:ValidationChain[]) => {
  const handler:Handler = async (req,res,next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) return next();
    const extractedErrors:Strings[] = [];
    errors.array().map(err => extractedErrors.push({[err.param]:err.msg}));
    return next({errors:extractedErrors});
  };
  return [...validators,handler];
};
export type ActionResponse = {
  data:Enum<any,string>;
  user?:string;
  auth?:AnyBoolean;
  status?:number;
  token?:string;
};
export const handleApiAction = (action:(req:Request) => Promise<ActionResponse>,statusOK:number = 200) => {
  const handler:Handler = async (req,res,next) => {
    try {
      const {user,data,auth} = await action(req);
      res.locals.user = user,
      res.locals.data = data,
      res.locals.auth = auth,
      res.locals.status = statusOK;
      return next();
    }
    catch(e){return next(e);}
  };
  return handler;
};
export const refreshApiUserCreds = (cookieName:string,ekey:string,authSecret:string) => {
  const handler:Handler = async (req,res,next) => {
  try{
      const appuser = res.locals.user||req.appuser;
      const appuserEnc = appuser?OB.encrypt(ekey,appuser):null;
      const token = res.locals.auth?generateTkn({appuser,okto:"use-api",role:"USER"},authSecret):null;
      appuserEnc?res.cookie(cookieName,appuserEnc,{maxAge:900000,httpOnly:true}):null;
      res.locals.token = token;
      return next();
    }
    catch(e){return next(e);}
  };
  return handler;
};
export const handleApiResponse = () => {
  const handler:Handler = async (req,res,next) => res.status(res.locals.status).json(res.locals);
  return handler;
};
export const sendreq = async <T>(o:SendReqOpts):Promise<T> => {
  const fetch = (await require("node-fetch")).default;
  try{
    //if(opts.ssl) opts = Object.assign({},opts,{});//SSLCertInfo);//readCert();
    const {url,...opts} = o;
    const res = await fetch(url,opts);
    const data = await res.json() as T;
    if(!res.ok) throw res.text();
    else return data;
  }
  catch(e){OB.error(e.message);throw e;}
};
export const mapUserRole = <R extends Strings>(roles:R,role?:Values<R>) => {
  const keys = Object.keys(roles);
  if(!role) return keys[0];
  else return keys.find(r => roles[r] == role);
};
export const validateUserRole = <R extends Strings>(roles:R) => {
  const keys = Object.keys(roles);
  const handler:Handler = async (req,res,next) => {
    const {role} = req.authtkn;
    const badRole = !keys.includes(role);
    if(badRole) return next(new AppError({message:"unauthorized",status:401}));
    return next();
  };
  return handler;
};
export type OBNotificationData = {method:string;type:string;user:string;data:any};
export const notifyUser = async (o:OBNotificationData,doSend?:boolean|number) => doSend?OB.ok(o):null;