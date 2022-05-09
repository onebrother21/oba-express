import { Router } from "express";
import { Enum, AnyBoolean } from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";
export declare type MainApiConstructor = (app: OBACore) => Promise<Router>;
export declare type MainApiActionResponse = {
    data: Enum<any, string>;
    user?: string;
    auth?: AnyBoolean;
    status?: number;
    token?: string;
};
