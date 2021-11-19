/// <reference types="node" />
import { Request } from "express";
import jwt from "jsonwebtoken";
import { ValidationChain } from "express-validator";
import { AnyBoolean, Enum } from "@onebro/oba-common";
import { Handler, SendReqOpts } from "./middleware-handler-types";
export declare const readCert: () => {
    cert: Buffer;
    key: Buffer;
    passphrase: string;
    ca: Buffer;
};
export declare const generateTkn: (payload: any, secret: string, opts?: any) => string;
export declare const verifyTkn: (header: string, secret: string) => string | jwt.JwtPayload;
export declare const getApiUserCreds: (cookieName: string, cookieSecret: string, authSecret: string) => Handler;
export declare const validateApiUserCreds: () => Handler;
export declare const handleReqValidation: (validators: ValidationChain[]) => (Handler | ValidationChain)[];
export declare type ActionResponse = {
    data: Enum<any, string>;
    user?: string;
    auth?: AnyBoolean;
    status?: number;
    token?: string;
};
export declare const handleApiAction: (action: (req: Request) => Promise<ActionResponse>, statusOK?: number) => Handler;
export declare const refreshApiUserCreds: (cookieName: string, cookieSecret: string, authSecret: string) => Handler;
export declare const handleApiResponse: () => Handler;
export declare const sendreq: <T>(o: SendReqOpts) => Promise<T>;
