import {J} from "../../utils";
import {OBAExpressDBInitTests} from "./db";
import {OBAExpressEmitterInitTests} from "./emitter";
import {OBAExpressErrorFactoryInitTests} from "./error-factory";
import {OBAExpressLoggerInitTests} from "./logger";
import {OBAExpressVarsInitTests} from "./vars";

export const OBAExpressCoreInitTests = () => J.utils.desc("OBA Express Api Core",() => {
  OBAExpressVarsInitTests();
  OBAExpressEmitterInitTests();
  OBAExpressErrorFactoryInitTests();
  OBAExpressLoggerInitTests();
  OBAExpressDBInitTests();
});