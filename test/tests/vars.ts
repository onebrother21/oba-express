import {J} from "../utils";
import {OBACoreApi,OBACoreConfig,masterConfig} from "../../src";

export const obaCoreVarsInitTests = () => J.desc("AM Vars Init",() => {
  let m:OBACoreApi<null>,c:OBACoreConfig,vars:OBACoreApi<null>["vars"];
  it("init",async () => {
    c = masterConfig("OBA_CORE");
    m = new OBACoreApi({vars:c.vars});
    J.is(m);
    J.true(m.vars);
    vars = m.vars;});
  it("has vars",async () => {
    J.is(vars);
    //console.log({vars});
  });
});