import {J} from "../../utils";
import { OBAExpressMiddlewareInitTests } from "./middleware";
import { OBAExpressAppInitTests } from "./app";
import { OBAExpressSocketsInitTests } from "./sockets";
import { OBAExpressInitTests } from "./api";

export const OBAExpressComponentsTests = () => J.desc("OBA Express Api Components",() => {
  //OBAExpressMiddlewareInitTests();
  //OBAExpressAppInitTests();
  //OBAExpressSocketsInitTests();
  OBAExpressInitTests();
});

