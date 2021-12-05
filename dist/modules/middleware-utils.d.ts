import { Request } from "express";
import OB, { Enum } from "@onebro/oba-common";
import { ApiUserID } from "./vars-types";
export declare const morganMsgTokens: OB.TypedMethods<Request, string>;
export declare const morganMsgFormats: Enum<string, undefined, "access" | "warn" | "error" | "info">;
export declare type CheckCORS = Partial<{
    origin: string;
    origins: string[];
    whitelist: ApiUserID[];
    blacklist: ApiUserID[];
}>;
export declare const checkCORS: ({ origin, origins, whitelist, blacklist }: CheckCORS) => boolean;
