import { Request } from "express";
import jwt from "jsonwebtoken";
import {ValidationChain,validationResult} from "express-validator";
import OB,{Keys,Values,Strings,AppError,AnyBoolean,Enum} from "@onebro/oba-common";
import {Handler,ApiActionResponse} from "./common-handler-types";
import { ok } from "assert";

export const mapUserRole = <R extends Strings>(roles:R,role?:Values<R>) => {
  const keys = Object.keys(roles);
  if(!role) return keys[0];
  else return keys.find(r => roles[r] == role);
};
export const generateTkn = (payload:any,secret:string,opts?:any) => jwt.sign(payload,secret,opts);
export const verifyTkn = (token:string,secret:string) => jwt.verify(token,secret);

export const validateApiUser = (o:Partial<{cookie:string;ekey:string;secret:string}>,authReq?:boolean) => {
  const handler:Handler = async (req,res,next) => {
    try{
      const {cookie,ekey,secret} = o;
      if(cookie && ekey){
        const appuser = req.cookies[cookie] as string;
        const userinfo = cookie?OB.decrypt(ekey,appuser):null;
        req.role = userinfo.split("/")[0];
        req.user = (userinfo.split("/")[1]).split(":")[0];
        req.device = userinfo.split(":")[1];
      }
      if(secret){
        const header = req.headers.authorization;
        const headerParts = header?.split(" ")||[];
        const validTknFormat = headerParts.length == 2 && ["Bearer","Token"].includes(headerParts[0]) && OB.str(headerParts[1]);
        const token = validTknFormat?verifyTkn(headerParts[1],secret):null;
        req.token = token;
      }
      if(authReq && !(req.user && req.token)) throw new AppError({
        message:"Not Authorized",
        status:401
      });
      return next();
    }
    catch(e){return next(e);}
  };
  return handler;
};
export const validateApiUserRole = <R extends Strings>(roles:R) => {
  const handler:Handler = async (req,res,next) => {
    const badRole = !Object.keys(roles).includes(req.role);
    if(badRole) return next(new AppError({message:"unauthorized",status:401}));
    return next();
  };
  return handler;
};
export const validateApiReq = (validators:ValidationChain[]) => {
  const handler:Handler = async (req,res,next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()) return next();
    const extractedErrors:Strings[] = [];
    errors.array().map(err => extractedErrors.push({[err.param]:err.msg}));
    return next({errors:extractedErrors});
  };
  return [...validators,handler];
};
export const handleApiAction = (action:(req:Request) => Promise<ApiActionResponse>,statusOK:number = 200) => {
  const handler:Handler = async (req,res,next) => {
    try {
      const {user,device,role,okto,data,auth} = await action(req);
      res.locals.data = data,
      res.locals.okto = okto;
      res.locals.auth = !!auth,
      res.locals.user = user || req.user,
      res.locals.device = device || req.device,
      res.locals.role = role || req.role,
      res.locals.status = statusOK;
      return next();
    }
    catch(e){return next(e);}
  };
  return handler;
};
export const refreshApiUser = (o:Partial<{cookie:string;ekey:string;secret:string;}>) => {
  const handler:Handler = async (req,res,next) => {
    try {
      const {cookie,ekey,secret} = o;
      if(cookie && ekey){
        const userinfo = `${res.locals.role}/${res.locals.user}:${res.locals.device}`;
        const appuser = userinfo?OB.encrypt(ekey,userinfo):null;
        appuser?res.cookie(cookie,appuser,{maxAge:900000,httpOnly:true}):null;
      }
      if(secret){
        const token = res.locals.auth?generateTkn({
          user:res.locals.user,
          device:res.locals.device,
          role:res.locals.role,
          okto:res.locals.okto,
        },secret):null;
        res.locals.token = token;
      }
      return next();
    }
    catch(e){return next(e);}
  };
  return handler;
};
export const sendResponse = () => {
  const handler:Handler = async (req,res) => {
    delete res.locals.role;
    delete res.locals.device;
    delete res.locals.auth;
    delete res.locals.okto;
    res.status(res.locals.status).json(res.locals);
  };
  return handler;
};