import express,{Router} from "express";
import { Keys } from "@onebro/oba-common";
import { CustomHandlers } from "./express-handler-types";
import OBACoreApi from "@onebro/oba-core-api";

export interface PublicOpts {maxAge:3000000;dirname:string;}
export interface ViewsOpts {engine:string;dirname:string;}
export interface CompressionOpts {}
export interface MorganOpts {useDev?:boolean;useLogger?:boolean;}
export interface CorsOpts {
  origins:string[];
  preflightContinue:boolean;
  credentials:boolean;}
export interface CookieParserOpts {secret?:string;}
export interface MongoStoreOpts {
  mongoUrl:string;
  collectionName?:string;
  autoRemove?:"native"|"interval"|"disabled";
  autoRemoveInterval?:number;
  autoReconnect?:boolean;}
export interface SessionOpts {
  name:string;
  secret:string;
  resave?:boolean;
  saveUninitialized?:boolean;
  cookie?:{maxAge:number;};
  store?:MongoStoreOpts;}
export interface LuscaOpts {
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
  referrerPolicy?:"same-origin"|string;}
export interface CsrfOpts {cookie:boolean;}
export interface HelmetOpts {
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
  referrerPolicy?:"same-origin"|string;}
export interface BodyParserOpts {
  json?:{limit?:string;};
  urlencoded?:{extended?:boolean};
  raw?:{type?:string;limit?:string;};}
export interface PassportOpts {}
export interface FlashOpts {}
export interface ErrorHandlerOpts {}

export type GetCustomHandlers <EV> = (core:OBACoreApi<EV>) => CustomHandlers<OBACoreApi<EV>>;
export type OBAExpressApiRouterConstructor<EV> = (core:OBACoreApi<EV>) => Router;
export type OBAExpressApiRouter = Router;
export type OBAExpressApiEndpoint = {path:string,methods:string[]};

export interface OBAExpressApiMiddlewareConfig<EV> {
  public?:PublicOpts;
  views?:ViewsOpts;
  compression?:CompressionOpts;
  morgan?:MorganOpts;
  cors?:CorsOpts;
  cookieParser?:CookieParserOpts;
  session?:SessionOpts;
  lusca?:LuscaOpts;
  helmet?:HelmetOpts;
  csrf?:CsrfOpts;
  bodyParser?:BodyParserOpts;
  passport?:PassportOpts;
  flash?:FlashOpts;
  errorhandler?:ErrorHandlerOpts;
  main?:OBAExpressApiRouterConstructor<EV>;
  custom?:GetCustomHandlers<EV>;
  pageNotFound:null;
  finalHandler:null;
}
export type OBAExpressApiMiddlewareKeys<EV> = Keys<OBAExpressApiMiddlewareConfig<EV>>;
export type OBAExpressApiMiddlewareSetter<EV,k extends OBAExpressApiMiddlewareKeys<EV>> = (
  app:express.Application,
  opts?:OBAExpressApiMiddlewareConfig<EV>[k],
  core?:OBACoreApi<EV>) => void;
export type OBAExpressApiMiddlewareSetters<EV> = {[k in OBAExpressApiMiddlewareKeys<EV>]:OBAExpressApiMiddlewareSetter<EV,k>;};
export type OBAExpressApiMiddlewareType<EV> = Partial<OBAExpressApiMiddlewareSetters<EV>>;