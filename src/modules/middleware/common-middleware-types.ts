import {AnyBoolean} from "@onebro/oba-common";
import { ApiUserID } from "../vars";

export type PublicOpts = {maxAge:3000000;dirname:string;};
export type ViewsOpts = {engine:string;dirname:string;};
export type MorganOpts = {useDev?:boolean;useLogger?:boolean;};
export type CorsOpts = {
  origins:string[];
  preflightContinue:boolean;
  credentials:boolean;
  skip?:string[];
};
export type CorsValidationParams = {
  origin:string;
  origins:string[];
  blacklist?:string|ApiUserID[];
};
export type CookieParserOpts = {secret?:string;};
export type MongoStoreOpts = {
  mongoUrl:string;
  collectionName?:string;
  autoRemove?:"native"|"interval"|"disabled";
  autoRemoveInterval?:number;
  autoReconnect?:boolean;
};
export type SessionOpts = {
  name:string;
  secret:string;
  resave?:boolean;
  saveUninitialized?:boolean;
  cookie?:{maxAge:number;};
  store?:MongoStoreOpts;
};
export type JwtOpts = {secret:string;};
export type LuscaOpts = {
  csrf?:boolean|{cookie?:string|any;};
  csp?:any;
  xframe?:"SAMEORIGIN"|string;
  p3p?:string;
  hsts?:{
    maxAge:number;
    includeSubDomains:boolean;
    preload:boolean;};
  xssProtection?:boolean;
  nosniff?:boolean;
  referrerPolicy?:"same-origin"|string;
};
export type CsrfOpts = {cookie:boolean;};
export type HelmetOpts = {
  csrf?:boolean|{cookie?:string|any;};
  csp?:any;
  xframe?:"SAMEORIGIN"|string;
  p3p?:string;
  hsts?:{
    maxAge:number;
    includeSubDomains:boolean;
    preload:boolean;};
  xssProtection?:boolean;
  nosniff?:boolean;
  referrerPolicy?:"same-origin"|string;
};
export type BodyParserOpts = {
  json?:{limit?:string;};
  urlencoded?:{extended?:boolean};
  raw?:{type?:string;limit?:string;};
};
export type PassportOpts = {};

export type OBAExpressCommonMiddlewareConfig = Partial<{
  disablePoweredBy:AnyBoolean;
  flash:AnyBoolean;
  errorhandler:AnyBoolean;
  compression:AnyBoolean;
  public:PublicOpts;
  views:ViewsOpts;
  morgan:MorganOpts;
  cors:CorsOpts;
  cors_ext:CorsOpts & {skip?:string[]};
  bodyParser:BodyParserOpts;
  cookieParser:CookieParserOpts;
  session:SessionOpts;
  lusca:LuscaOpts;
  helmet:HelmetOpts;
  csrf:CsrfOpts;
  passport:PassportOpts;
  pageNotFound:null;
  finalHandler:null;
}>;