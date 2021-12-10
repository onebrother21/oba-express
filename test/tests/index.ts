import {J} from "../utils";
import { OBAExpressMiddlewareInitTests } from "./middleware";
import { OBAExpressAppInitTests } from "./app";
import { OBAExpressSocketsInitTests } from "./sockets";
import { OBAExpressApiInitTests } from "./api";

export const OBAExpressApiTests = () => J.desc("OBA Express Api Server",() => {
  //OBAExpressMiddlewareInitTests();
  //OBAExpressAppInitTests();
  //OBAExpressSocketsInitTests();
  OBAExpressApiInitTests();
});