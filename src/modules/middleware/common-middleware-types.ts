import {AnyBoolean} from "@onebro/oba-common";

export type MorganOpts = Partial<Record<"useDev"|"useLogger",boolean>>;
export type CookieParserOpts = {secret?:string;};
export type MongoSessionStoreOpts = {
  mongoUrl:string;
  collectionName?:string;
  autoRemove?:"native"|"interval"|"disabled";
  autoRemoveInterval?:number;
  autoReconnect?:boolean;
  touchAfter:86400;
  stringify:boolean;
};
export type SessionOpts = {
  name:string;
  secret:string|string[];
  resave?:boolean;
  saveUninitialized?:boolean;
  cookie?:{
    path?:string;
    signed?:boolean;
    secure?:boolean;
    maxAge?:number;
    httpOnly?:boolean;
    sameSite?:false|"strict"|"lax"|"none";
    domain?:string;
  };
  store?:MongoSessionStoreOpts;
};
export type CsrfOpts = {
  cookie?:boolean|{
    key?:string;
    path?:string;
    signed?:boolean;
    secure?:boolean;
    maxAge?:number;
    httpOnly?:boolean;
    sameSite?:false|"strict"|"lax"|"none";
    domain?:string;
  };
};
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
export type CorsOpts = {
  whitelist:string[];
  preflightContinue:boolean;
  credentials:boolean;
  allowedHeaders:string[];
  methods:string[];
  maxAge:number;
  blacklist?:string[];
};
export type BodyParserOpts = {
  json?:{limit?:string;};
  urlencoded?:{extended?:boolean};
  raw?:{type?:string;limit?:string;};
};
export type UseStaticOpts = {maxAge:3000000;dirname:string;};
export type UseViewsOpts = {engine:string;dirname:string;};
export type MulterGfsOpts = Record<"dbUrl"|"fileSlug"|"bucketName",string>;

export type OBAExpressCommonMiddlewareConfig = Partial<{
  multer:MulterGfsOpts;
  compression:AnyBoolean;
  disablePoweredBy:AnyBoolean;
  morgan:MorganOpts;
  flash:AnyBoolean;
  cookieParser:CookieParserOpts;
  lusca:LuscaOpts;
  helmet:HelmetOpts;
  csrf:CsrfOpts;
  session:SessionOpts;
  cors:CorsOpts;
  bodyParser:BodyParserOpts;
  useStatic:UseStaticOpts;
  useViews:UseViewsOpts;
  errorhandler:AnyBoolean;
  pageNotFound:null;
  finalHandler:null;
}>;