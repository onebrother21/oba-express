import {Request,Response,NextFunction} from "express";
import {Enum,OfErrorType,AnyBoolean} from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";

export type Handler = (req:Request,res:Response,next:NextFunction) => Promise<Response|void>;
export type ErrorHandler = (e:OfErrorType,req:Request,res:Response,next:NextFunction) => Response|void;
export type FileReqHandler<U,DB> = (req:Request,res:Response,db:DB) => Promise<U>;
export type CustomHandler = (app:OBACore) => Promise<Handler>;
export type CustomHandlers = Enum<CustomHandler,string>;
export interface CookieBody {
  value:string;
  path?:string;
  "max-age"?:number;
  expires?:Date;
  httponly?:boolean;
  secure?:boolean;
}