import {J} from "../utils";
import { OBAExpressServerInitTests } from "./api";
import { OBAExpressCoreInitTests } from "./core";

export const init = () => J.utils.desc("INIT",() => {
  it("Init",async () => {await J.utils.refreshDb();},1E9);
});
export const wrapup = () => J.utils.desc("WRAPUP",() => {
  it("Wrapup",async () => {console.log("complete");},1E9);
});
export const obaExpressApiTests = () => J.utils.desc("OBA Express Api",() => {
  init();
  OBAExpressCoreInitTests();
  OBAExpressServerInitTests();
  wrapup();
});