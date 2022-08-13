import {Request} from "express";
import fs from "fs";
import path from "path";
import util from "util";
//import multer from "multer";
//import { GridFsStorage } from "multer-gridfs-storage";
import OB,{Enum,Strings,TypedMethods} from "@onebro/oba-common";
import { CorsOpts, MulterGfsOpts } from "./common-middleware-types";

export type MorganLoggerTypes = "access"|"warn"|"error"|"info";
export const morganMsgTokens:TypedMethods<Request,string> = {
  errLogMsg:(req:Request) => {
    const msg:any = {
      id:req.id,
      //ts:new Date().toLocaleString("en-US",OB.locals.dateFormat as any),
      name:req.error?req.error.name:"",
      msg:req.error?req.error.message:"",
      stack:req.error?req.error.stack:"",
    };
    req.error&&req.error.warning?msg.warning = req.error.warning:null;
    req.error&&req.error.code?msg.code = req.error.code:null;
    req.error&&req.error.info?msg.info = req.error.info:null;
    req.error&&req.error.errors?msg.errors = req.error.errors:null;
    return JSON.stringify(msg);
  },
  time:() => new Date().toLocaleString("en-US",OB.locals.dateFormat as any),
  appuser:(req:Request) => (((req as any).appuser)||{}).username,
  hostname:(req:Request) => req.headers["host"] || req.hostname,
  reqid:(req:Request) => req.id||"",
  contentType:(req:Request) => req.headers["content-type"],
  headers:(req:Request) => req.headers?JSON.stringify(req.headers):"",
  query:(req:Request) => req.query?JSON.stringify(req.query):"",
  params:(req:Request) => req.params?JSON.stringify(req.params):"",
  body:(req:Request) => req.body?JSON.stringify(req.body):"",
};
const accessTokenStrs:Strings = {
  id:`"id":":reqid"`,
  host:`"host":":hostname"`,
  ip:`"ip":":remote-addr"`,
  user:`"user":":appuser"`,
  referrer:`"referrer":":referrer"`,
  agent:`"agent":":user-agent"`,
  http:`"http":":http-version"`,
  method:`"method":":method"`,
  path:`"url":":url"`,
  resStatus:`"status":":status"`,
  resSize:`"res-size":":res[content-length]"`,
  resTime:`"res-time":":total-time"`,
};
const accessLogMsg = "{" + Object.keys(accessTokenStrs).map(k => accessTokenStrs[k as any]).join(",") +"}";
export const morganMsgFormats:Enum<string,undefined,MorganLoggerTypes> = {
  access:accessLogMsg,
  warn:`:errLogMsg`,
  error:`:errLogMsg`,
};
export const validateCORS = (origin:string,whitelist:CorsOpts["whitelist"]) => {
  // allow requests with no origin, like mobile apps or curl requests? -> NO UNTIL FURTHER GUIDANCE
  if(!origin) return false;
  if(whitelist) for(let i = 0,l = whitelist.length;i<l;i++) if(OB.match(new RegExp(whitelist[i]),origin)) return true;
  return false;
};
export const readCert = () => {
  const certFile = path.resolve(__dirname, "ssl/client.crt");
  const keyFile = path.resolve(__dirname, "ssl/client.key");
  const caFile = path.resolve(__dirname, "ssl/ca.cert.pem");
  const SSLCertInfo = {
    cert:fs.readFileSync(certFile),
    key:fs.readFileSync(keyFile),
    passphrase:"password",
    ca:fs.readFileSync(caFile)
  };
  return SSLCertInfo;
};
/*
export const loadMulterGfsSingle = ({dbUrl,fileSlug,bucketName}:MulterGfsOpts,multiple?:boolean) => {
  const {generateBytes} = GridFsStorage;
  const storage = new GridFsStorage({
    url:dbUrl,
    options:{useNewUrlParser:true,useUnifiedTopology:true},
    cache:true,
    file:(req,file) => {
      return new Promise(done => {
        const fileTypes = ["image/png","image/jpeg","image/jpg"];
        const filename = `${Date.now()}-${fileSlug}-${file.originalname}`;
        //const filename = await generateBytes().filename + path.extname(file.originalname);
        done(!fileTypes.includes(file.mimetype)?filename:{bucketName,filename});
      });
    }
  });
  const uploadFiles = multiple?multer({storage}).single("file"):multer({storage}).array("file",10);;
  const uploadFilesHandler = util.promisify(uploadFiles);
  return uploadFilesHandler;
};
*/