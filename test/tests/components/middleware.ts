import {J} from "../../utils";
import {App} from "../../app";
import {TestAppApi} from "../../../src/dev-server";

export const OBAExpressMiddlewareInitTests = () => J.desc("AM Middleware Init",() => {
  let api:TestAppApi;
  it("init",async () => {
    api = (await App.init()).api;
    J.is(api);
    J.true(api.app);
  });
});