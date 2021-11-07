import { Enum, Strings, Info } from "@onebro/oba-common";
export declare type ApiUserID = Enum<string, "ip", "username" | "loc" | "id">;
export declare type ApiCredentials = Enum<string, "id" | "key", "num"> & Strings;
export declare type ApiSettings = {
    checkConn?: boolean | number;
    requireKey?: boolean;
} & Info;
export declare type ApiVarsBase = Enum<string, "host" | "env" | "entry"> & Enum<number, "port">;
export declare type OBAExpressApiVars = ApiVarsBase & Partial<{
    settings: ApiSettings;
    providers: Enum<ApiCredentials>;
    consumers: Enum<ApiCredentials>;
    whitelist: ApiUserID[];
    blacklist: ApiUserID[];
}>;
