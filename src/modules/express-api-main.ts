import {OBACoreApi} from "@onebro/oba-core-api";
import express, { Router } from "express";
import {OBAExpressApiSockets} from "./sockets-main";
import {createServer} from "http";
import {
  OBAExpressApiEndpoint,
  OBAExpressApiType,
  OBAExpressApiConfig
} from "./express-api-types";
import {
  OBAExpressApiMiddleware,
  OBAExpressApiMiddlewareConfig,
  OBAExpressApiMiddlewareSetter,
  OBAExpressApiMiddlewareKeys,
} from "./middleware-main";
import listEndpoints from "express-list-endpoints";
import util from "util";
import dns from "dns";
import {interval,of} from "rxjs";
import {takeWhile,tap,catchError} from "rxjs/operators";
import * as ob from "@onebro/oba-common";

export interface OBAExpressApi<EV> extends OBAExpressApiType<EV> {}
export class OBAExpressApi<EV> extends OBACoreApi<EV> {
  constructor(public config_app:OBAExpressApiConfig<EV>) {
    super(config_app);
    this.vars_app = config_app.vars_app;
    this.app = this.createRouter();
    this.server = this.app?createServer(this.app):null;
    this.io = config_app.sockets && this.server?this.io = new OBAExpressApiSockets(config_app.sockets,this.server):null;
    ob.ok("OBAExpressApi configuration done...");
  }
  createRouter(){
    const {main,middleware:middlewareConfig} = this.config_app;
    const app = express();
    app.disable("x-powered-by");
    const middleware = new OBAExpressApiMiddleware<EV>();
    if(middlewareConfig){
      const custom = middlewareConfig.custom(this);
      const customNames = Object.keys(custom);
      const setCustomMiddleware = (k:string,b:1|0) => {
        customNames.forEach(s => {
          const handler = custom[s];
          handler.before == k && b?app.use(handler.func(this)):
          handler.after == k && !b?app.use(handler.func(this)):
          null;
        });
      };
      const mainSetter = () => app.use(this.vars_app.entry,main?main(this):Router());
      for(const k in middlewareConfig){
        if(k != "custom"){
          const k1 = k as OBAExpressApiMiddlewareKeys<EV>;
          const opts = middlewareConfig[k1];
          const setter = middleware[k1];
          setCustomMiddleware(k,1);
          k == "main"?mainSetter():setter?setter(app,opts as any,this):null;
          setCustomMiddleware(k,0);
        }
      }
    }
    middleware.pageNotFound(app,null,this);
    middleware.finalHandler(app,null,this);
    return app;
  }
  get routes():OBAExpressApiEndpoint[]{return listEndpoints(this.app);}
  start = async ():Promise<void> => {
    const {name,env} = this.vars;
    const {port,host} = this.vars_app;
    await this.db.start();
    await this.monitor();
    this.server.listen(port,() => console.log("Welcome!",this.vars.name,"running @",this.server.address()));
      //this.events.emit("serverOK",{port,host,name,env});
  }
  async monitor(){
    const check = this.vars_app.settings.checkConn;
    const errCtrl = this.e;
    const events = this.events;
    if(check){
      let live = true;
      const source = interval(1000 * (ob.bool(check)?10:<number>check));
      const loop = source.pipe(
        takeWhile(() => live),
        tap(async() => {
          const isConnected = util.promisify(dns.lookupService);
          const connected = await isConnected("8.8.8.8",53);
          ob.ok("Network Connection OK");}),
        catchError((e:Error) => of((e:Error) => {
          //events.emit("error",errCtrl.map(e));
          ob.warn("No Network Connection");
          live = false;})));
      return loop.subscribe();
    }
  }
}
export default OBAExpressApi;
export * from "./express-api-types";