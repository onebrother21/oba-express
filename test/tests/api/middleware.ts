import {J} from "../../utils";
import {TestAppApi} from "../../test-app-api";

export const OBAExpressMiddlewareInitTests = () => J.utils.desc("AM Middleware Init",() => {
  let api:TestAppApi;
  it("init",async () => {
    api = (await J.utils.init("OBA_EXPRESS")).api;
    J.is(api);
    J.true(api.app);
  });
});