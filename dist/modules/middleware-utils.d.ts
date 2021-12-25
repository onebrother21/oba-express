import { Request } from "express";
import { Enum, TypedMethods } from "@onebro/oba-common";
import { ApiUserID } from "./vars-types";
export declare type MorganLoggerTypes = "access" | "warn" | "error" | "info";
export declare const morganMsgTokens: TypedMethods<Request, string>;
export declare const morganMsgFormats: Enum<string, undefined, MorganLoggerTypes>;
export declare type CheckCORS = Partial<{
    origin: string;
    origins: string[];
    whitelist: ApiUserID[];
    blacklist: ApiUserID[];
}>;
export declare const checkCORS: ({ origin, origins, whitelist, blacklist }: CheckCORS) => boolean;
