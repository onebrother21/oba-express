import { Request } from "express";
import {ValidationChain,validationResult} from "express-validator";
import OB,{Strings,AppError} from "@onebro/oba-common";
import {Handler,ApiActionResponse} from "./common-handler-types";
import { generateTkn, verifyTkn } from "./common-handler-utils";

export const validateApiUser = (o:Partial<{cookie:string;ekey:string;secret:string}>,authReq?:boolean) => {
  const handler:Handler = async (req,res,next) => {
    try{
      const {cookie,ekey,secret} = o;
      req.appuser = {};
      if(cookie && ekey){
        const appuser = req.cookies[cookie] as string;
        const userinfo = cookie && appuser?OB.decrypt(ekey,appuser):"";
        if(userinfo){
          req.appuser.role = userinfo.split("/")[0];
          req.appuser.username = (userinfo.split("/")[1]).split(":")[0];
          req.appuser.device = userinfo.split(":")[1];
        }
      }
      if(secret){
        const header = req.headers.authorization;
        const headerParts = header?.split(" ")||[];
        const validTknFormat = headerParts.length == 2 && ["Bearer","Token"].includes(headerParts[0]) && OB.str(headerParts[1]);
        const token = validTknFormat?verifyTkn(headerParts[1],secret):null as any;
        req.token = token;
        req.appuser = {...token};
      }
      if(authReq && !req.token) throw new AppError({
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
    const badRole = !Object.keys(roles).includes(req.appuser.role);
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
      req.appuser = {...req.appuser};
      res.locals.data = data,
      res.locals.okto = okto,
      res.locals.auth = !!auth,
      res.locals.username = user || req.appuser.username,
      res.locals.device = device || req.appuser.device,
      res.locals.role = role || req.appuser.role,
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
      const {username,device,role,okto,auth} = res.locals;
      if(cookie && ekey && username){
        const userstr = `${role||"-"}/${username}:${device}`;
        const appuser = OB.encrypt(ekey,userstr);
        res.cookie(cookie,appuser,{maxAge:900000,httpOnly:true});
      }
      if(secret && auth) res.locals.token = generateTkn({username,device,role,okto},secret);
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