import {J} from "../../utils";
import {App} from "../../app";
import {TestAppApi} from"../../../src/dev-server";

export const OBAExpressSocketsInitTests = () => J.desc("AM Sockets Init",() => {
  let api:TestAppApi,sockets:any;
  it("init",async () => {
    api = (await App.init()).api;
    J.is(api);
    J.true(api.io);
  });
});