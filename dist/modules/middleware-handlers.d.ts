/// <reference types="node" />
import { Request } from "express";
import jwt from "jsonwebtoken";
import { ValidationChain } from "express-validator";
import { Values, Strings, AnyBoolean, Enum } from "@onebro/oba-common";
import { Handler, SendReqOpts } from "./middleware-handler-types";
export declare type ActionResponse = {
    data: Enum<any, string>;
    user?: string;
    auth?: AnyBoolean;
    status?: number;
    token?: string;
};
export declare const readCert: () => {
    cert: Buffer;
    key: Buffer;
    passphrase: string;
    ca: Buffer;
};
export declare const mapUserRole: <R extends Strings<undefined>>(roles: R, role?: Values<R>) => string;
export declare const generateTkn: (payload: any, secret: string, opts?: any) => string;
export declare const validateTkn: (token: string, secret: string) => string | jwt.JwtPayload;
export declare const validateApiUser: (cookieName: string, ekey: string, authSecret: string) => Handler;
export declare const validateApiUserRole: <R extends Strings<undefined>>(roles: R) => Handler;
export declare const validateApiReq: (validators: ValidationChain[]) => (Handler | ValidationChain)[];
export declare const handleApiAction: (action: (req: Request) => Promise<ActionResponse>, statusOK?: number) => Handler;
export declare const refreshApiUser: (cookieName: string, ekey: string, authSecret: string) => Handler;
export declare const sendResponse: () => Handler;
export declare const sendRequest: <T>(o: SendReqOpts) => Promise<T>;
export declare type OBNotificationData = {
    method: string;
    type: string;
    user: string;
    data: any;
};
export declare const notifyApiUser: (o: OBNotificationData, doSend?: boolean | number) => Promise<boolean>;
