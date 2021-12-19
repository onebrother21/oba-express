import {Request,Response,NextFunction,Router } from "express";
import {Enum,OfErrorType,AnyBoolean} from "@onebro/oba-common";
import OBACoreApi from "@onebro/oba-core-api";

export type Handler = (req:Request,res:Response,next:NextFunction) => Promise<Response|void>;
export type ErrorHandler = (e:OfErrorType,req:Request,res:Response,next:NextFunction) => Response|void;
export type FileReqHandler<U,DB> = (req:Request,res:Response,db:DB) => Promise<U>;
export type CustomHandlerCreator = (app:OBACoreApi) => Promise<Handler>;
export type MainApiConstructor = (app:OBACoreApi) => Promise<Router>;
export type CustomHandlerConfig = {
  func:CustomHandlerCreator;
  before?:string;
  after?:string;
  active?:AnyBoolean;
};
export type CustomHandlers = Enum<CustomHandlerConfig,string>;
export type RouterEndpoint = {path:string,methods:string[]};
export interface CookieBody {
  value:string;
  path?:string;
  "max-age"?:number;
  expires?:Date;
  httponly?:boolean;
  secure?:boolean;
}
export interface SendReqAuthOptions {
  user?:string;
  username?:string;
  pass?:string;
  password?:string;
  sendImmediately?:boolean;
  bearer?:string|(() => string);
}
export interface SendReqOpts {
  url:string;
  method:"get"|"put"|"post"|"delete";
  headers?:{[key:string]:string;};
  auth?:SendReqAuthOptions;
  ssl?:boolean;
  form?:{[key:string]:any;};
  body:any;
}