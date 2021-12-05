import OBA from "@onebro/oba-common";
import { TestAppApiConfig,TestAppApi } from "./test-app-types";


export const getListeners = (api:TestAppApi) => ({
  //"config":c => OB.here("l",c),
  //"init":b => OB.ok("Running @...",Date.now()),
  //"dbOK":o => OB.here("l",o),
  //"shutdown":o => api.db.shutdown(),
  //"test":b => OB.here("l",{test:b}),
  //"serverOK":o => OB.here("l",`${o.name} is now running on ${o.host}:${o.port} @ ${Date.now()}`),
});