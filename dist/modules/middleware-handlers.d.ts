/// <reference types="node" />
import jwt from "jsonwebtoken";
import { ValidationChain } from "express-validator";
import { Handler } from "./middleware-handler-types";
import { SendReqOpts } from "./middleware-base-types";
export declare const readCert: () => {
    cert: Buffer;
    key: Buffer;
    passphrase: string;
    ca: Buffer;
};
export declare const generateTkn: (payload: any, secret: string, opts?: any) => string;
export declare const verifyTkn: (header: string, secret: string) => string | jwt.JwtPayload;
export declare const getAuthTkn: (secret: string) => Handler;
export declare const validateAuthTkn: () => Handler;
export declare const handleReqValidation: (validators: ValidationChain[]) => (Handler | ValidationChain)[];
export declare const handleApiAction: (action: Function, statusOK?: number) => Handler;
export declare const handleApiResponse: () => Handler;
export declare const sendreq: <T>(o: SendReqOpts) => Promise<T>;
