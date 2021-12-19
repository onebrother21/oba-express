import { Router } from "express";
import { body } from "express-validator";
import {
  Handler,
  generateTkn,
  getApiUserCreds,
  validateApiUserCreds,
  refreshApiUserCreds,
  handleReqValidation,
  handleApiAction,
  handleApiResponse,
  MainApiConstructor,
} from "../../src";

export type TestAppMainApi = MainApiConstructor;
export const TestAppMainApi:TestAppMainApi = async api => {
  const config = api.config as any;
  const k$ = config.middleware["auth"].ekey;
  const c$ = config.middleware["auth"].cookie;
  const s$ = config.middleware["auth"].secret;
  const a1 = getApiUserCreds(c$,k$,s$);
  const a2 = validateApiUserCreds();
  const a3 = refreshApiUserCreds(c$,k$,s$);
  const v1 = handleReqValidation([
    body("admin").exists(),
    body("admin").equals("ObAuth")
  ]);
  const h1 = handleApiAction(async (req) => ({data:{ready:true}}),200);
  const h2 = handleApiAction(async (req) => ({data:{config:api.config.toString()}}),200);
  const h3 = handleApiAction(async (req) => ({data:{test:10},auth:true,user:"jackswift"}),200);
  const h4 = handleApiAction(async (req) => ({data:{test:11},auth:true,user:"jackswift"}),200);
  const r1 = handleApiResponse();
  const r2:Handler = async (req,res,next) => res.render("index");
  
  const router = Router();
  const entry = "/oba-express/v1/en";
  router.get("/",h1,r1);
  router.get("/sample",r2);
  router.get("/test-only",h1,r1);
  router.post("/test-only",v1,h2,r1);
  router.post(entry+"/test-tkn",v1,h3,a3,r1);
  router.get(entry+"/test-tkn",a1,a2,h4,a3,r1);
  return router;
};
export default TestAppMainApi;