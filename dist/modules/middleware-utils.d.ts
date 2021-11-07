import { Request } from "express";
import OBA, { Strings } from "@onebro/oba-common";
import { ApiUserID } from "./vars-types";
export declare const morganMsgTokens: OBA.TypedMethods<Request, string>;
export declare const morganMsgFormats: Strings;
export declare type CheckCORS = Partial<{
    origin: string;
    origins: string[];
    whitelist: ApiUserID[];
    blacklist: ApiUserID[];
}>;
export declare const checkCORS: ({ origin, origins, whitelist, blacklist }: CheckCORS) => boolean;
