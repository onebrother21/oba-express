import { Request } from "express";
import { ValidationChain } from "express-validator";
import { Handler, ApiActionResponse } from "./common-handler-types";
export declare const validateApiUser: (o: Partial<{
    cookie: string;
    ekey: string;
    secret: string;
}>, authReq?: boolean) => Handler;
export declare const validateApiUserRole: <R extends string>(roles: R[]) => Handler;
export declare const validateApiReq: (validators: ValidationChain[]) => (Handler | ValidationChain)[];
export declare const handleApiAction: (action: (req: Request) => Promise<ApiActionResponse>, statusOK?: number) => Handler;
export declare const refreshApiUser: (o: Partial<{
    cookie: string;
    ekey: string;
    secret: string;
}>) => Handler;
export declare const sendResponse: () => Handler;
