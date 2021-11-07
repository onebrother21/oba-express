import express, { Router } from "express";
import {createServer} from "http";
import listEndpoints from "express-list-endpoints";
import util from "util";
import dns from "dns";
import {interval,of} from "rxjs";
import {takeWhile,tap,catchError} from "rxjs/operators";

import OBA,{AnyBoolean} from "@onebro/oba-common";
import OBACoreApi from "@onebro/oba-core-api";
import {OBAExpressApiConfig} from "./express-api-config-type";
import {OBAExpressApiBaseType} from "./express-api-base-type";
import {RouterEndpoint} from "./middleware-handler-types";
import {OBAExpressApiMiddlewareKeys} from "./middleware-types";
import {OBAExpressApiMiddleware} from "./middleware-main";
import {OBAExpressApiSockets} from "./sockets-main";

export interface OBAExpressApi<Ev,Sockets> extends OBAExpressApiBaseType<Ev,Sockets> {}
export class OBAExpressApi<Ev,Sockets> {
  constructor(public config:OBAExpressApiConfig<Ev,Sockets>) {}
  init = () => {
    const core = new OBACoreApi<Ev>(this.config);
    core.init();
    const {config,...core_} = core;
    Object.assign(this,core_);
    this.app = this.createRouter();
    this.server = this.app?createServer(this.app):null;
    const isSocketServer = this.config.sockets && this.server;
    if(isSocketServer) this.io = new OBAExpressApiSockets(this.config.sockets,this.server);
    //this.events.emit("config",c);
  }
  createRouter(){
    const app = express();
    const middleware = new OBAExpressApiMiddleware<Ev,Sockets>();
    const {middleware:middlewareConfig} = this.config;
    const noMiddleware = !middlewareConfig||OBA.empty(middlewareConfig);
    const custom = (middlewareConfig||{}).custom;
    const main = (middlewareConfig||{}).main;
    const mainSetter = () => {
      main?
      app.use(this.vars.entry,main(this)):
      app.get(this.vars.entry,(req,res) => res.json({ready:true}));
    };
    const setCustomMiddleware = (k:string,b:1|0) => {
      if(custom) for(const m in custom){
        const handler = custom[m];
        handler.active?
        handler.before == k && b?app.use(handler.func(this)):
        handler.after == k && !b?app.use(handler.func(this)):
        null:null;
      }
    };
    if(noMiddleware) mainSetter();
    else for(const k in middlewareConfig) if(k != "custom"){
      const k1 = k as OBAExpressApiMiddlewareKeys<Ev,Sockets>;
      const opts = middlewareConfig[k1];
      const setter = middleware[k1];
      setCustomMiddleware(k,1);
      k == "main"?mainSetter():setter?setter(app,opts as any,this):null;
      setCustomMiddleware(k,0);
    }
    middleware.pageNotFound(app,null,this);
    middleware.finalHandler(app,null,this);
    return app;
  }
  get routes():RouterEndpoint[]{return listEndpoints(this.app);}
  start = async (db?:AnyBoolean,server?:AnyBoolean):Promise<void> => {
    await this.monitor();
    if(db) await this.startDb();
    if(server) await this.startServer();
  }
  private startDb = async ():Promise<void> => await this.db.start();
  private startServer = async ():Promise<void> => new Promise(done => this.server.listen(this.vars.port,() => done()));
  async monitor(){
    const check = this.vars.settings.checkConn;
    const errCtrl = this.e;
    const events = this.events;
    if(check){
      let live = true;
      const source = interval(1000 * (OBA.bool(check)?10:<number>check));
      const loop = source.pipe(
        takeWhile(() => live),
        tap(async() => {
          const isConnected = util.promisify(dns.lookupService);
          const connected = await isConnected("8.8.8.8",53);
          OBA.ok("Network Connection OK");}),
        catchError((e:Error) => of((e:Error) => {
          //events.emit("error",errCtrl.map(e));
          OBA.warn("No Network Connection");
          live = false;})));
      return loop.subscribe();
    }
  }
}
export default OBAExpressApi;