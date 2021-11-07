import { Router } from "express";
import { body } from "express-validator";
import { TestAppMainApi } from "./test-app-types";
import {
  Handler,
  handleReqValidation,
  getAuthTkn,
  validateAuthTkn,
  generateTkn,
} from "../../src";

const TestAppMainApi:TestAppMainApi = api => {
  const c$ = api.config.middleware["auth"].cookie;
  const s$ = api.config.middleware["auth"].secret;
  const a1 = getAuthTkn(s$);
  const a2 = validateAuthTkn();
  const v1 = handleReqValidation([
    body("admin").exists(),
    body("admin").equals("ObAuth")
  ]);
  const ready:Handler = async (req,res,next) => res.json({ready:true});
  const readyTkn:Handler = async (req,res,next) => res.json({ready:true,token:generateTkn({user:"jack",yessir:12},s$)});
  const renderView:Handler = async (req,res,next) => res.render("index");
  const sendConfig:Handler = async (req,res,next) => res.json({config:api.events.values["config"].toString()});
  const printTkn:Handler = async (req,res,next) => {console.log((<any>req).authtkn);next();};
  
  const router = Router();
  router.get("/",ready);
  router.get("/test-only",ready);
  router.post("/test-only",v1,sendConfig);
  router.get("/oba-express/v1/en/test-only",ready);
  router.post("/oba-express/v1/en/test-only",v1,readyTkn);
  router.get("/oba-express/v1/en/test-tkn",a1,a2,printTkn,readyTkn);
  router.get("/sample",renderView);
  return router;
};
export {TestAppMainApi};