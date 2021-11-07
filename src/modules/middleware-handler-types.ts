import {Request,Response,NextFunction,Router } from "express";
import {Enum,OfErrorType,AnyBoolean} from "@onebro/oba-common";
import {OBAExpressApiBaseType} from "./express-api-base-type";

export type Handler = (req:Request,res:Response,next:NextFunction) => Promise<Response|void>;
export type ErrorHandler = (e:OfErrorType,req:Request,res:Response,next:NextFunction) => Response|void;
export type AsyncHandler = (req:Request,res:Response,next:NextFunction) => Promise<Response|void>;
export type FileReqHandler<U,DB> = (req:Request,res:Response,db:DB) => Promise<U>;
export type CustomHandler<Ev,Sockets> = (app:OBAExpressApiBaseType<Ev,Sockets>) => AsyncHandler;
export type MainApiConstructor<Ev,Sockets> = (app:OBAExpressApiBaseType<Ev,Sockets>) => Router;
export type CustomHandlerConfig<Ev,Sockets> = {
  func:CustomHandler<Ev,Sockets>;
  before?:string;
  after?:string;
  active?:AnyBoolean;
};
export type CustomHandlers<Ev,Sockets> = Enum<CustomHandlerConfig<Ev,Sockets>,string>;
export type RouterEndpoint = {path:string,methods:string[]};