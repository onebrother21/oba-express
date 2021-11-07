import {OBACoreConfig} from "@onebro/oba-core-api";
import {OBAExpressApiVars} from "./vars-types";
import {OBAExpressApiMiddlewareConfig} from "./middleware-types";
import {OBAExpressApiSocketsConfig} from "./sockets-main";

export type OBAExpressApiConfig<Ev,Sockets> = Partial<{
  vars:OBACoreConfig<Ev>["vars"] & OBAExpressApiVars;
  logger:OBACoreConfig<Ev>["logger"];
  errors:OBACoreConfig<Ev>["errors"];
  e:OBACoreConfig<Ev>["errors"];
  events:OBACoreConfig<Ev>["events"];
  db:OBACoreConfig<Ev>["db"];
  middleware:OBAExpressApiMiddlewareConfig<Ev,Sockets>;
  sockets:OBAExpressApiSocketsConfig<Sockets>;
}>;