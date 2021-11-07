import OBA from "@onebro/oba-common";
import { TestAppApiConfig,TestAppApi } from "./test-app-types";


export const getListeners = (api:TestAppApi):Partial<TestAppApiConfig["events"]> => ({
  //"config":c => console.log(c),
  //"init":b => OBA.ok("Running @...",Date.now()),
  //"dbOK":o => console.log(o),
  //"shutdown":o => api.db.shutdown(),
  //"test":b => console.log({test:b}),
  //"serverOK":o => console.log(`${o.name} is now running on ${o.host}:${o.port} @ ${Date.now()}`),
});