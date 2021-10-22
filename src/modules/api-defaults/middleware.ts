import { Request,Response,NextFunction } from "express";
import { GetCustomHandlers } from "../middleware-types";
import { DefaultEvents } from "./app-events";
//import { SendReqOpts, sendreq } from "../middleware-utils";
import * as ob from "@onebro/oba-common";

export const DefaultCustomMiddlewares:GetCustomHandlers<DefaultEvents> = m => {
  return {};
  /*return {
    apiGuard:{
      after:"cors",
      func:m => async (req:Request,res:Response,next:NextFunction) => {
        const consumers = m.vars.consumers;
        if(consumers){
          const name = req.url.split("/").slice(1)[0];
          const consumer = consumers[name];
          if(consumer){
            const id = req.headers["am-client-id"] as string||null;
            const key = req.headers["am-client-key"] as string||null;
            const valid = consumer && id && key?id === consumer.id && key === consumer.key:false;
            //ob.log(name,consumer,id,key,valid);
            if(!(id && key)) return next(m.e.missing(401,"API credentials not provided"));
            if(!valid) return next(m.e.invalid(401,"API credentials invalid"));}}
        return next();}},
    appShake:{
      after:"session",
      func:() => async (req:Request,res:Response,next:NextFunction) => {
        /*
        if(req.cookies._caOB){
          let randomNumber = Math.random().toString();
          randomNumber = randomNumber.substring(2,randomNumber.length);
          res.cookie("_baOB",randomNumber,{maxAge:900000,httpOnly:true});}
        else if(req.cookies._aB){
          let randomNumber = Math.random().toString();
          randomNumber = randomNumber.substring(2,randomNumber.length);
          res.cookie("_bcOB",randomNumber,{maxAge:900000,httpOnly:true});}
        else {
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2,randomNumber.length);
        res.cookie("_bc_0",randomNumber,{maxAge:900000,httpOnly:true});
        return next();}},
    reqCounter:{
      after:"session",
      func:m => async (req:Request,res:Response,next:NextFunction) => {
        const within1Min = req.session.lastReq?((Date.now() - req.session.lastReq)/1000) <= 60:true;
        if(within1Min) req.session.visits = (req.session.visits||0)+1;
        else req.session.visits = 1;
          //req.session.reqsPerMin = (req.session.visits/60);}
        //if(req.session.visits > 12) console.warn("whoa what is going on?");
        req.session.lastReq = Date.now();
        return next();
      }
    },
  };
  */
};

/*
  showOrigin:{
    before:"cors",
    func:m => async (req:Request,res:Response,next:NextFunction) => {
      ob.log(req.headers["origin"]);
      return next();}},
  ipData:{
    after:"session",
    func:m => async (req:Request,res:Response,next:NextFunction) => {
      if(req.session && !req.session.ipdata){
        const consumerkey = m.vars.providers["ip-data"];
        const ip = /127.0.0/.test(req.ip)?"":req.ip;
        const url = `https://consumer.ipdata.co${ip?"/"+ip:""}?consumer-key=${consumerkey}`;
        const opts:SendReqOpts = {url};
        req.session.ipdata = await sendreq(opts);}
      return next();}},
  addUserToLocals:{
    after:"session",
    func:m => async (req:Request,res:Response,next:NextFunction) => {
      res.locals.user = req.appuser;
      return next();}
*/