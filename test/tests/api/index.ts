import {J} from "../../utils";
import { OBAExpressMiddlewareInitTests } from "./middleware";
import { OBAExpressAppInitTests } from "./app";
import { OBAExpressSocketsInitTests } from "./sockets";
import { OBAExpressApiTests } from "./api";

export const OBAExpressServerInitTests = () => J.utils.desc("OBA Express Api Server",() => {
  //OBAExpressMiddlewareInitTests();
  //OBAExpressAppInitTests();
  //OBAExpressSocketsInitTests();
  OBAExpressApiTests();
});