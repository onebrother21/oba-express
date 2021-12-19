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
/* initial events
const badsignals = ["SIGUSR2","SIGINT","SIGTERM","exit"];
for(const i of badsignals) process.on(i,() => OB.warn("SYSTEM TERMINATING ::",i) && api.events.emit("shutdown",true));
api.events.emit("config",api.config);
api.events.emit("init",true);
const {name,env,port,host} = api.vars;
api.events.emit("serverOK",{name,env,host,port});
api.events.emit("ready",true as any);
*/