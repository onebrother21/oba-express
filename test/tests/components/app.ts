import {J} from "../../utils";
import {App} from "../../app";
import {TestAppApi} from "../../../src/dev";
import supertest,{SuperTest,Test} from "supertest";
import OB from "@onebro/oba-common";

export const OBAExpressAppInitTests = () => J.desc("AM App Init",() => {
  let api:TestAppApi,app:SuperTest<Test>;
  it("init",async () => {
    api = (await App.init()).api;
    J.is(api);
    J.true(api.app);
    J.is(api.routes);
  },1E9);
  it("has app",async () => J.is(api.app));
  it("has routes",async () => {
    OB.log("Routes:",api.routes);
    J.arr(api.routes);
    J.gt(api.routes.length,0);
  });
  it("app server boot",async () => {
    app = supertest(api.app);
    J.is(app);
  });
});