import {J} from "../../utils";
import {TestAppApi} from "../../test-app-api";

export const OBAExpressSocketsInitTests = () => J.utils.desc("AM Sockets Init",() => {
  let api:TestAppApi,sockets:any;
  it("init",async () => {
    api = (await J.utils.init("OBA_EXPRESS")).api;
    J.is(api);
    J.true(api.io);
  });
});