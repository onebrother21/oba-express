import express from "express";
import listEndpoints from "express-list-endpoints";
import util from "util";
import dns from "dns";
import {createServer} from "http";
import {interval,of} from "rxjs";
import {takeWhile,tap,catchError} from "rxjs/operators";

import OB,{Component,AnyBoolean,AppError} from "@onebro/oba-common";
import OBACore from "@onebro/oba-core";
import {createApp} from "./create-app";
import {createSockets} from "./create-sockets";
import {OBAExpressConfigType,OBAExpressType} from "./types";
import {OBAExpressRouterEndpoint} from "../middleware";

export type OBAExpressConfig<Sockets> = OBAExpressConfigType<Sockets>;
export interface OBAExpress<Ev = undefined,Sockets = undefined> extends Component<OBAExpressConfig<Sockets>,Ev>,OBAExpressType<Ev,Sockets>{}
export class OBAExpress<Ev = undefined,Sockets = undefined> extends Component<OBAExpressConfig<Sockets>,Ev> {
  get e(){return this.errors;}
  get v(){return this.vars;}
  set v(vars:OBAExpress<Ev,Sockets>["vars"]){this.vars = vars;}
  get routes():OBAExpressRouterEndpoint[]{return listEndpoints(this.app);}
  createApp = createApp;
  createSockets = createSockets;
  init = async (db?:AnyBoolean,server?:AnyBoolean):Promise<void> => {
    await this.initCore(db);
    await this.initServer(server);
  };
  initCore = async (start?:AnyBoolean) => {
    const core = new OBACore<Ev>(this.config);
    await core.init(start);
    delete core.config;
    Object.assign(this,core);
  };
  initServer = async (start?:AnyBoolean) => {
    this.app = await this.createApp(this as any);
    this.server = this.app?createServer(this.app):null;
    const isSocketServer = this.config.sockets && this.server;
    const checkConn = this.server && this.vars.settings && this.vars.settings.checkConn;
    if(isSocketServer) this.io = await this.createSockets<Sockets>(this as any);
    if(checkConn) await this.monitorServer();
    if(start) this.startServer();
  };
  startServer = async () => {
    const PORT = this.vars.port;
    const HOST = this.vars.host;
    const serverOK = () => {
      const started = new Date();
      const {address,port} = this.server.address() || {} as any;
      const server = {host:HOST,address,port,started};
      OB.ok(`Api Server Started --> ${this.vars.name}`);
      this.logger.postLogMsg("info",OB.stringify({server}));
    };
    const serverErr = (e:AppError) => {
      if(e.code === "EADDRINUSE"){
        OB.log("Address in use, retrying (2)...");
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
  monitorServer = async () => {
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
}
export default OBAExpress;