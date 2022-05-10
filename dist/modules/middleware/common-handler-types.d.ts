import { Request, Response, NextFunction } from "express";
import { Enum, OfErrorType } from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";
export declare type Handler = (req: Request, res: Response, next: NextFunction) => Promise<Response | void>;
export declare type ErrorHandler = (e: OfErrorType, req: Request, res: Response, next: NextFunction) => Response | void;
export declare type FileReqHandler<U, DB> = (req: Request, res: Response, db: DB) => Promise<U>;
export declare type CustomHandler = (app: OBACore) => Promise<Handler>;
export declare type CustomHandlers = Enum<CustomHandler, string>;
export interface CookieBody {
    value: string;
    path?: string;
    "max-age"?: number;
    expires?: Date;
    httponly?: boolean;
    secure?: boolean;
}
