import { Request, Response, NextFunction, Router } from "express";
import { Enum, OfErrorType, AnyBoolean } from "@onebro/oba-common";
import { OBAExpressApiBaseType } from "./express-api-base-type";
export declare type Handler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export declare type ErrorHandler = (e: OfErrorType, req: Request, res: Response, next: NextFunction) => Response | void;
export declare type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export declare type FileReqHandler<U, DB> = (req: Request, res: Response, db: DB) => Promise<U>;
export declare type CustomHandler<Ev, Sockets> = (app: OBAExpressApiBaseType<Ev, Sockets>) => AsyncHandler;
export declare type MainApiConstructor<Ev, Sockets> = (app: OBAExpressApiBaseType<Ev, Sockets>) => Router;
export declare type CustomHandlerConfig<Ev, Sockets> = {
    func: CustomHandler<Ev, Sockets>;
    before?: string;
    after?: string;
    active?: AnyBoolean;
};
export declare type CustomHandlers<Ev, Sockets> = Enum<CustomHandlerConfig<Ev, Sockets>, string>;
export declare type RouterEndpoint = {
    path: string;
    methods: string[];
};
