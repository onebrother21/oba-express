import { Request } from "express";
import jwt from "jsonwebtoken";
import { ValidationChain } from "express-validator";
import { Values, Strings } from "@onebro/oba-common";
import { Handler, ApiActionResponse } from "./common-handler-types";
export declare const mapUserRole: <R extends Strings<undefined>>(roles: R, role?: Values<R>) => string;
export declare const generateTkn: (payload: any, secret: string, opts?: any) => string;
export declare const verifyTkn: (token: string, secret: string) => string | jwt.JwtPayload;
export declare const validateApiUser: (o: Partial<{
    cookie: string;
    ekey: string;
    secret: string;
}>, authReq?: boolean) => Handler;
export declare const validateApiUserRole: <R extends Strings<undefined>>(roles: R) => Handler;
export declare const validateApiReq: (validators: ValidationChain[]) => (Handler | ValidationChain)[];
export declare const handleApiAction: (action: (req: Request) => Promise<ApiActionResponse>, statusOK?: number) => Handler;
export declare const refreshApiUser: (o: Partial<{
    cookie: string;
    ekey: string;
    secret: string;
}>) => Handler;
export declare const sendResponse: () => Handler;
