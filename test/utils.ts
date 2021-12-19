import mongoose from "mongoose";
import supertest,{Response} from "supertest";
import {AnyBoolean,Enum} from "@onebro/oba-common";
import {testAppApiConfig} from "./test-app-api";

export type ResponseData = {
  cookieArr:string[];
  cookies:Enum<any,string>;
  csrfToken?:string;
  authToken?:string;
  body?:any;
};
export const J = {
  desc:describe,
  type:(a:any,b:string) => expect(typeof a).toBe(b),
  instance:(a:any,b:any) => expect(a instanceof b).toBe(true),
  cookies:(a:any) => expect(Array.isArray(a)).toBe(true),
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
  refreshDb:async (s:string) => {
    const {api} = await testAppApiConfig(s);
    const db = await mongoose.createConnection(api.config.db.uri).asPromise();
    await db.dropDatabase();
  },
  initApp:async (s:string,withTestApp?:AnyBoolean) => {
    try{
      const {api} = await testAppApiConfig(s);
      await api.init(1);
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
  parseCookieArray:(data:Partial<ResponseData>,cookieArr:string[]) => {
    try{
      if(!(cookieArr&&cookieArr.length)){return data;}
      const cookieNames = [];
      const cookies = {};
      if(!data.cookieArr.length) data.cookieArr = cookieArr;
      else for(let i=0;i<cookieArr.length;i++){
        const cookieStr = cookieArr[i];
        const {name} = J.parseCookie(cookieStr);
        let didMatch = false,isMatch = false;
        data.cookieArr = data.cookieArr.map(str => {
          isMatch = new RegExp(name).test(str);
          didMatch = isMatch||didMatch;
          return isMatch?cookieStr:str;
        });
        !didMatch?data.cookieArr.push(cookieStr):null;
      }
      for(let i=0;i<data.cookieArr.length;i++){
        const {name,cookie} = J.parseCookie(data.cookieArr[i]);
        cookie.index = i;
        data.cookies[name] = cookie;
      }
      return data;
    }
    catch(e){console.error(e);throw e;}
  },
  newResponseData:():ResponseData => ({cookieArr:[],cookies:{},csrfToken:"",authToken:"",body:{}}),
  handleResponse:(data:ResponseData,res:Response) => {
    J.parseCookieArray(data,res.header["set-cookie"]);
    data.cookies["XSRF-TOKEN"]?data.csrfToken =  data.cookies["XSRF-TOKEN"].value:null;
    res.body && res.body.token?data.authToken = res.body.token:null;
    data.body = res.body;
    return data;
  }
};