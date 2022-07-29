/// <reference types="node" />
import { Request } from "express";
import { Enum, TypedMethods } from "@onebro/oba-common";
import { CorsOpts } from "./common-middleware-types";
export declare type MorganLoggerTypes = "access" | "warn" | "error" | "info";
export declare const morganMsgTokens: TypedMethods<Request, string>;
export declare const morganMsgFormats: Enum<string, undefined, MorganLoggerTypes>;
export declare const validateCORS: (origin: string, whitelist: CorsOpts["whitelist"]) => boolean;
export declare const readCert: () => {
    cert: Buffer;
    key: Buffer;
    passphrase: string;
    ca: Buffer;
};
