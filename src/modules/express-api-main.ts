import express, { Router } from "express";
import {createServer} from "http";
import listEndpoints from "express-list-endpoints";
import util from "util";
import dns from "dns";
import {interval,of} from "rxjs";
import {takeWhile,tap,catchError} from "rxjs/operators";

import OB,{Component,AnyBoolean, AppError} from "@onebro/oba-common";
import OBACoreApi from "@onebro/oba-core-api";
import {OBAExpressApiConfigType,OBAExpressApiBaseType} from "./express-api-types";
import {RouterEndpoint} from "./middleware-handler-types";
import {OBAExpressApiMiddlewareKeys} from "./middleware-types";
import {OBAExpressApiMiddleware} from "./middleware-main";
import {OBAExpressApiSockets} from "./sockets-main";

export type OBAExpressApiConfig<Sockets> = OBAExpressApiConfigType<Sockets>;
export interface OBAExpressApi<Ev = undefined,Sockets = undefined> extends Component<OBAExpressApiConfig<Sockets>,Ev>,OBAExpressApiBaseType<Ev,Sockets>{}
export class OBAExpressApi<Ev = undefined,Sockets = undefined> extends Component<OBAExpressApiConfig<Sockets>,Ev> {
  get e(){return this.errors;}
  get v(){return this.vars;}
  set v(vars:OBAExpressApi<Ev,Sockets>["vars"]){this.vars = vars;}
  get routes():RouterEndpoint[]{return listEndpoints(this.app);}
  startServer = async () => {
    const PORT = this.vars.port;
    const HOST = this.vars.host;
    const serverOK = () => {
      const started = new Date();
      const info = OB.stringify({...this.vars,started});
      OB.ok("Server started now man",this.server.address());
      this.logger.postLogMsg("info",info);
    };
    const serverErr = (e:AppError) => {
      if(e.code === "EADDRINUSE"){
        OB.log("Address in use, retrying...");
        setTimeout(() => {
          this.server.close();
          this.server.listen(PORT);
        },1000);
      }
    };
    this.server.on("listening",serverOK);
    this.server.on("error",serverErr);
    this.server.listen(PORT);
  };
  createApp = async () => {
    const api = this as any;
    const app = express();
    const middleware = OBAExpressApiMiddleware.init();
    const {middleware:middlewareConfig} = this.config;
    const noMiddleware = !middlewareConfig||OB.empty(middlewareConfig);
    const custom = middlewareConfig?.custom;
    const main = middlewareConfig?.main;
    const mainSetter = async () => {
      main?
      app.use(this.vars.entry,await main(api)):
      app.get(this.vars.entry,(req,res) => res.json({ready:true}));
    };
    const setCustomMiddleware = async (k:string,b:1|0) => {
      if(custom) for(const m in custom){
        const handler = custom[m];
        handler.active?
        handler.before == k && b?app.use(await handler.func(api)):
        handler.after == k && !b?app.use(await handler.func(api)):
        null:null;
      }
    };
    if(noMiddleware) await mainSetter();
    else for(const k in middlewareConfig) if(k != "custom"){
      const k1 = k as OBAExpressApiMiddlewareKeys;
      const opts = middlewareConfig[k1];
      const setter = middleware[k1];
      await setCustomMiddleware(k,1);
      k == "main"?await mainSetter():setter?setter(app,opts as any,api):null;
      await setCustomMiddleware(k,0);
    }
    middleware.pageNotFound(app,null,api);
    middleware.finalHandler(app,null,api);
    return app;
  };
  initCore = async (start?:AnyBoolean) => {
    const core = new OBACoreApi<Ev>(this.config);
    await core.init(start);
    delete core.config;
    Object.assign(this,core);
  };
  initServer = async (start?:AnyBoolean) => {
    this.app = await this.createApp();
    this.server = this.app?createServer(this.app):null;
    const isSocketServer = this.config.sockets && this.server;
    const checkConn = this.server && this.vars.settings && this.vars.settings.checkConn;
    if(isSocketServer) this.io = OBAExpressApiSockets.init(this.config.sockets,this.server);
    if(checkConn) await this.monitor();
    if(start) this.startServer();
  };
  monitor = async () => {
    const check = this.vars.settings.checkConn;
    if(check){
      let live = true;
      const source = interval(1000 * (OB.bool(check)?10:<number>check));
      const loop = source.pipe(
        takeWhile(() => live),
        tap(async() => {
          const isConnected = util.promisify(dns.lookupService);
          const connected = await isConnected("8.8.8.8",53);
          OB.ok("Network Connection OK");
        }),
        catchError((e:Error) => of((e:Error) => {
          //events.emit("error",errCtrl.map(e)); <- MISIMPLEMENTATION
          OB.warn("No Network Connection");
          live = false;
        }))
      );
      return loop.subscribe();
    }
  };
  init = async (db?:AnyBoolean,server?:AnyBoolean):Promise<void> => {
    await this.initCore(db);
    await this.initServer(server);
  };
}
export default OBAExpressApi;