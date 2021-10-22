
   
import {Request,Response,NextFunction } from "express";
import {ErrorType} from "@onebro/oba-common";

export type Handler = (req:Request,res:Response,next:NextFunction) => Promise<Response|void>;
export type ErrorHandler = (e:ErrorType,req:Request,res:Response,next:NextFunction) => Response|void;
export type AsyncHandler = (req:Request,res:Response,next:NextFunction) => Promise<Response|void>;
export type FileReqHandler<U,DB> = (req:Request,res:Response,db:DB) => Promise<U>;
export type GetHandler<T> = (m:T) => Handler|AsyncHandler|ErrorHandler;
export type CustomHandlers<T> = {[k:string]:{func:GetHandler<T>;before?:string;after?:string;};};