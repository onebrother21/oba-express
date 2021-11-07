import {J} from "../../utils";
import {TestAppApi} from "../../test-app-api";

export const OBAExpressVarsInitTests = () => J.utils.desc("AM Vars Init",() => {
  let api:TestAppApi;
  it("init",async () => {
    api = (await J.utils.init("OBA_EXPRESS")).api;
    J.is(api);
    J.true(api.vars);
  });
  it("has vars",async () => {
    J.is(api.vars);
    console.log(api.vars);
  });
});