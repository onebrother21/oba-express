import { Request } from "express";
import morgan from "morgan";
import { Enum, TypedMethods } from "@onebro/oba-common";
import { ApiUserID } from "./vars-types";
import { OBACoreLogger } from "@onebro/oba-core-api";
export declare type MorganLoggerTypes = "access" | "warn" | "error" | "info";
export declare const morganMsgTokens: TypedMethods<Request, string>;
export declare const morganMsgFormats: Enum<string, undefined, MorganLoggerTypes>;
export declare const morganMsgFormatFlags: Enum<string, MorganLoggerTypes>;
export declare const makeMorganOpts: (logger: OBACoreLogger, k: MorganLoggerTypes) => morgan.Options<any, any>;
export declare type CheckCORS = Partial<{
    origin: string;
    origins: string[];
    whitelist: ApiUserID[];
    blacklist: ApiUserID[];
}>;
export declare const checkCORS: ({ origin, origins, whitelist, blacklist }: CheckCORS) => boolean;
