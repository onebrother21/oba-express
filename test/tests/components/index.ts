import {J} from "../../utils";
import { OBAExpressMiddlewareInitTests } from "./middleware";
import { OBAExpressAppInitTests } from "./app";
import { OBAExpressSocketsInitTests } from "./sockets";
import { OBAExpressApiInitTests } from "./api";

export const OBAExpressApiComponentsTests = () => J.desc("OBA Express Api Components",() => {
  //OBAExpressMiddlewareInitTests();
  //OBAExpressAppInitTests();
  //OBAExpressSocketsInitTests();
  OBAExpressApiInitTests();
});

