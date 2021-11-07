import express from "express";
import {Server} from "http";
import OBACoreApi from "@onebro/oba-core-api";
import {OBAExpressApiVars} from "./vars-types";
import {OBAExpressApiSockets} from "./sockets-main";
import {OBAExpressApiConfig} from "./express-api-config-type";

export type OBAExpressApiBaseType<Ev,Sockets> = {
  config:OBAExpressApiConfig<Ev,Sockets>;
  vars:OBACoreApi<Ev>["vars"] & OBAExpressApiVars;
  logger:OBACoreApi<Ev>["logger"];
  errors:OBACoreApi<Ev>["e"];
  e:OBACoreApi<Ev>["e"];
  events:OBACoreApi<Ev>["events"];
  db:OBACoreApi<Ev>["db"];
  app:express.Express;
  server:Server;
  io:OBAExpressApiSockets<Sockets>;
};