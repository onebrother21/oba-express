import {J} from "../utils";
import {App} from "../app";
import {OBAExpressApiComponentsTests} from "./components";
import OB from "@onebro/oba-common";

export const init = () => J.desc("INIT",() => {
  it("Init",async () => {await App.refresh();},1E9);
});
export const finalCheck = () => J.desc("INIT EXPRESS API",() => {
  it("Final Init Core Api",async () => {
    const {api} = await App.init();
    //api.print();
  },1E9);
});
export const wrapup = () => J.desc("WRAPUP",() => {
  it("Wrapup",async () => {OB.log("complete");},1E9);
});
export const allTests = () => J.desc("ALL TESTS",() => {
  init();
  OBAExpressApiComponentsTests();
  finalCheck();
  wrapup();
});