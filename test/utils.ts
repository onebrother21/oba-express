import mongoose from "mongoose";
import supertest,{Response} from "supertest";
import OBA,{AnyBoolean,Enum} from "@onebro/oba-common";
import {testAppApiConfig} from "./test-app-api/test-app-config";

export type ResponseData = {
  cookieArr:string[];
  cookies:Enum<any,string>;
  csrfToken?:string;
  authToken?:string;
  body?:any;
};
export const utils = {
  sleep:(n:number) => new Promise(done => setTimeout(done,n)),
  clear:() => process.stdout.write("\x1Bc"),
  desc:describe,
  refreshDb:async () => {
    const db = await mongoose.createConnection("mongodb://localhost:27017/ob1").asPromise();
    await db.dropDatabase();
  },
  init:async (s:string,withTestApp?:AnyBoolean) => {
    try{
      const {api} = await testAppApiConfig(s);
      await api.init();
      const badsignals = ["SIGUSR2","SIGINT","SIGTERM","exit"];
      for(const i of badsignals) process.on(i,() => OBA.warn("SYSTEM TERMINATING ::",i) && api.events.emit("shutdown",true));
      api.events.emit("config",api.config);
      api.events.emit("init",true);
      const {name,env,port,host} = api.vars;
      await api.start(1).then(() => {
        api.events.emit("serverOK",{name,env,host,port});
        api.events.emit("ready",true as any);
      });
      const app = supertest(api.app);
      return {api,...withTestApp?{app}:null};
    }
    catch(e){console.error(e);throw e;}
  },
  parseCookie:(cookieStr:string) => {
    const cookieObj:any = {name:"",cookie:{}};
    cookieStr
    .split(",")
    .map((p,i,a) => /Expires/.test(p)?(p = p.concat(",",a[i+1])):p)
    .filter((p,i) => !(i%2))
    .forEach((p,i) => {
      const o:any = {};
      let name = "_unknown_";
      p.split("; ").forEach((s,j) => {
        const k = s.split("=");
        if(!j){name = k[0];o["value"] = k[1];}
        else if(!k[1]){o[k[0].toLocaleLowerCase()] = true;}
        else{o[k[0].toLocaleLowerCase()] = k[1];}});
      cookieObj.name = name;
      cookieObj.cookie = o;});
    return cookieObj;
  },
  parseCookieArray:(data:{cookieArr:string[];cookies:any;},arr:string[]) => {
    try{
      const cookieNames = [];
      if(!(arr&&arr.length)){return data;}
      else {
        for(let i=0;i<arr.length;i++){
          const {name,cookie} = utils.parseCookie(arr[i]);
          cookie.index = i;
          cookieNames.push(name);
          data.cookies = Object.assign({},data.cookies,{[name]:cookie});
        }
        if(!data.cookieArr.length) data.cookieArr = arr;
        else {
          cookieNames.forEach((c,i) => {
            let didMatch = false,isMatch = false;
            const cookie = arr[i];
            data.cookieArr = data.cookieArr.map(k => {
              isMatch = new RegExp(c).test(k);
              didMatch = isMatch||didMatch;
              return isMatch?cookie:k;});
            !didMatch?data.cookieArr.push(cookie):null;});
          }
        }
        return data;
      }
    catch(e){console.error(e);throw e;}
  },
  parseDelimitedString:(str:string,d:string = ",") => {
    const o:{[k:string]:string} = {};
    return str.split(d).reduce((o,v) => {
      const arr = v.split(":");
      o[arr[0]] = arr[1];
      return o;
    },o);
  },
  newResponseData:():ResponseData => ({cookieArr:[],cookies:{},csrfToken:"",authToken:"",body:{}}),
  handleResponse:(data:ResponseData,res:Response) => {
    utils.parseCookieArray(data,res.header["set-cookie"]);
    data.cookies["XSRF-TOKEN"]?data.csrfToken =  data.cookies["XSRF-TOKEN"].value:null;
    res.body && res.body.token?data.authToken = res.body.token:null;
    data.body = res.body;
    return data;
  }
};
export const J = {
  utils,
  type:(a:any,b:string) => expect(typeof a).toBe(b),
  instance:(a:any,b:any) => expect(a instanceof b).toBe(true),
  arr:(a:any) => expect(Array.isArray(a)).toBe(true),
  gt:(a:number,b:number) => expect(a).toBeGreaterThan(b),
  eq:(a:number,b:number,c:number=2) => expect(a).toBeCloseTo(b,c),
  ne:(a:number,b:number,c?:number) => expect(a).not.toBeCloseTo(b,c||2),
  is:(a:any,b?:any) => b!==undefined?expect(a).toBe(b):expect(a).toBeDefined(),
  not:(a:any,b?:any) => b!==undefined?expect(a).not.toBe(b):expect(a).not.toBeDefined(),
  match:(a:string,b:RegExp) => expect(a).toMatch(b),
  has:(a:string,b:string) => expect(a).toContain(b),
  includes:(a:any[],b:any) => expect(a.indexOf(b) > -1).toBe(true),
  prop:(a:any,b:any) => expect(a).toHaveProperty(b),
  true:(o:any) => expect(o).toBeTruthy(),
  throws:(o:Function) => expect(o()).toThrow(),
  doesNotThrow:(o:Function) => expect(o()).not.toThrow(),
  error:(o:any) => expect(o).toBeInstanceOf(Error),
  noterror:(o:any) => expect(o).not.toBeInstanceOf(Error),
};