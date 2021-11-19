import { Request, Response, NextFunction, Router } from "express";
import { Enum, OfErrorType, AnyBoolean } from "@onebro/oba-common";
import { OBAExpressApiBaseType } from "./express-api-base-type";
export declare type Handler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export declare type ErrorHandler = (e: OfErrorType, req: Request, res: Response, next: NextFunction) => Response | void;
export declare type FileReqHandler<U, DB> = (req: Request, res: Response, db: DB) => Promise<U>;
export declare type CustomHandlerCreator<Ev, Sockets> = (app: OBAExpressApiBaseType<Ev, Sockets>) => Promise<Handler>;
export declare type MainApiConstructor<Ev, Sockets> = (app: OBAExpressApiBaseType<Ev, Sockets>) => Promise<Router>;
export declare type CustomHandlerConfig<Ev, Sockets> = {
    func: CustomHandlerCreator<Ev, Sockets>;
    before?: string;
    after?: string;
    active?: AnyBoolean;
};
export declare type CustomHandlers<Ev, Sockets> = Enum<CustomHandlerConfig<Ev, Sockets>, string>;
export declare type RouterEndpoint = {
    path: string;
    methods: string[];
};
export interface CookieBody {
    value: string;
    path?: string;
    "max-age"?: number;
    expires?: Date;
    httponly?: boolean;
    secure?: boolean;
}
export interface SendReqAuthOptions {
    user?: string;
    username?: string;
    pass?: string;
    password?: string;
    sendImmediately?: boolean;
    bearer?: string | (() => string);
}
export interface SendReqOpts {
    url: string;
    method: "get" | "put" | "post" | "delete";
    headers?: {
        [key: string]: string;
    };
    auth?: SendReqAuthOptions;
    ssl?: boolean;
    form?: {
        [key: string]: any;
    };
    body: any;
}
