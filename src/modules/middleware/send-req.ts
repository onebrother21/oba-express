import OB from "@onebro/oba-common";

export interface SendReqAuthOptions {
  user?:string;
  username?:string;
  pass?:string;
  password?:string;
  sendImmediately?:boolean;
  bearer?:string|(() => string);
}
export interface SendReqOpts {
  url:string;
  method:"get"|"put"|"post"|"delete";
  headers?:{[key:string]:string;};
  auth?:SendReqAuthOptions;
  ssl?:boolean;
  form?:{[key:string]:any;};
  body:any;
}
export const sendRequest = async <T>(o:SendReqOpts):Promise<T> => {
  const fetch = (await require("node-fetch")).default;
  try{
    //if(opts.ssl) opts = Object.assign({},opts,{});//SSLCertInfo);//readCert();
    const {url,...opts} = o;
    const res = await fetch(url,opts);
    const data = await res.json() as T;
    if(!res.ok) throw res.text();
    else return data;
  }
  catch(e){OB.error(e.message);throw e;}
};
export type OBNotificationData = {method:string;type:string;user:string;data:any};
export const notifyApiUser = async (o:OBNotificationData,doSend?:boolean|number) => doSend?OB.ok(o):null;