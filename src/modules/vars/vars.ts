import {Enum,Strings,Info} from "@onebro/oba-common";

export type ApiUserID = Enum<string,"ip","username"|"loc"|"id">;
export type ApiCredentials = Enum<string,"id"|"key"|"owner"|"scope","num"> & Strings;

export type ApiSettings = {checkConn?:boolean|number;requireKey?:boolean;} & Info;
export type ApiVarsBase = Enum<string,"host"|"env"|"entry"> & Enum<number,"port">;

export type OBAExpressVars =  ApiVarsBase & Partial<{
  settings:ApiSettings;
  consumers:ApiCredentials[];
  providers:ApiCredentials[];
  whitelist:ApiUserID[];
  blacklist:ApiUserID[];
}>;