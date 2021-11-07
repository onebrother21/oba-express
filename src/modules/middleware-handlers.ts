import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import {ValidationChain,validationResult} from "express-validator";
import OBA,{encrypt,decrypt,Strings,AppError} from "@onebro/oba-common";
import {Handler} from "./middleware-handler-types";
import {SendReqOpts} from "./middleware-base-types";

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
export const getAuthTkn = (secret:string) => {
  const handler:Handler = async (req,res,next) => {
    try{
      req.authtkn = verifyTkn(req.headers.authorization,secret);
      return next();
    }
    catch(e){return next(e);}
  };
  return handler;
};
export const validateAuthTkn = () => {
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
export const handleApiAction = (action:Function,statusOK:number = 200) => {
  const handler:Handler = async (req,res,next) => {
    try {
      res.locals.actionResult = await action(req);
      res.locals.actionStatus = statusOK;
      return next();
    }
    catch(e){return next(e);}
  };
  return handler;
};
export const handleApiResponse = () => {
  const handler:Handler = async (req,res,next) => {
    if(!res.locals.actionResult) return next();
    res.status(res.locals.actionStatus).json(res.locals.actionResult);
  };
  return handler;
};
export const sendreq = async <T>(o:SendReqOpts):Promise<T> => {
  try{
    //if(opts.ssl) opts = Object.assign({},opts,{});//SSLCertInfo);//readCert();
    const fetch = ({url,...opts}:SendReqOpts) => import ("node-fetch").then(({default:f}) => f(url,opts));
    const res = await fetch(o);
    const data = await res.json() as T;
    if(!res.ok) throw res.text();
    else return data;
  }
  catch(e){OBA.error(e.message,e.code);throw e;}
};
/*
export const validateAppUser = (cookieName:string,key:string) => {
  const handler:Handler = async (req,res,next) => {
    const cookie = req.cookies[cookieName]  as string;
    if(cookie) req.appuser = decrypt(key,cookie);
    return next();};
  return handler;};
export const refreshAppUser = (cookieName:string,key:string) => {
  const handler:Handler = async (req,res,next) => {
    if(res.locals.actionResult){
      const usernameEnc = encrypt(key,res.locals.actionResult.username||req.appuser);
      res.cookie(cookieName,usernameEnc,{maxAge:900000,httpOnly:true});}
    return next();};
  return handler;};
export const mapUserRole = (K:Strings,k?:string) => !k?"G":Object.keys(K).find(s => K[s] == k);
export const validateUserRole = (roles?:string[]) => {
  const R = roles || ["USER","GUEST"];
  const handler:Handler = async (req,res,next) => {
    if(!R.includes(req.authtkn.role)) return next(new AppError({message:"unauthorized",status:401}));
    return next();};
  return handler;};
export type OBNotificationData = {method:string;type:string;user:string;data:any};
export const notifyUser = async (o:OBNotificationData,doSend?:boolean|number) => doSend?OBA.ok(o):null;
*/
