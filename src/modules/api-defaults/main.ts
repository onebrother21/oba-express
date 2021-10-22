import { Router,Request,Response } from "express";
import { body } from "express-validator";
//import { handleReqValidation } from "@onebro/oba-common";
import { OBAExpressApiRouterConstructor } from "../middleware-types";
import { DefaultEvents } from "./app-events";

const DefaultMainApp:OBAExpressApiRouterConstructor<DefaultEvents> = m => {
  const router = Router();
  router.get("/",(req,res,next) => res.json({ready:true}));
  router.get("/sample",(req,res,next) => res.render("index"));
  router.get("/test-only",(req,res,next) => res.json({ready:true}));
  router.post("/test-only",
    /*
    handleReqValidation([
      body("admin").exists(),
      body("admin").equals("ObAuth")
    ]),
    */
    (req:Request,res:Response) => res.json({config:m.events.get("config")}));
  router.get("/oba-express/v1/en/test-only",(req,res,next) => res.json({ready:true}));
  return router;};
export {DefaultMainApp};