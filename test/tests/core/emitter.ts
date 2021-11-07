import {J} from "../../utils";
import OBA from "@onebro/OBA-common";
import {TestAppApi} from "../../test-app-api";

export const OBAExpressEmitterInitTests = () => J.utils.desc("AM Emitter Init",() => {
  let api:TestAppApi;
  it("init",async () => {
    api = (await J.utils.init("OBA_EXPRESS")).api;
    J.is(api);
    J.true(api.events);
  });
  it("register listener",async () => {
    api.events.on("init",() => OBA.ok(api.vars.name," Running @...",Date.now()));
    api.events.on("config",b => console.log({config:b}));
    api.events.on("test",b => console.log({test:b}));
    api.events.on("dbOK",(o:any) => console.log(o));
    api.events.on("shutdown",() => api.db.shutdown());
    const badsignals = ["SIGUSR2","SIGINT","SIGTERM","exit"];
    for(const i of badsignals) process.on(i,() => OBA.warn("SYSTEM TERMINATING ::",i) && api.events.emit("shutdown",true));
    J.includes(api.events.listeners,"test");
  });
  it("send known event",async () => {
    api.events.emit("config",api.config);
    api.events.emit("dbOK",{name:"ob",uri:"siofhoidjf"});
    J.is(api.events.values["dbOK"].name,"ob");})
  it("send unknown event",async () => {
    api.events.emit("test",13);
    J.is(api.events.values["test"],13);});
  it("get listeners",async () => {
    J.arr(api.events.listeners);
    J.gt(api.events.listeners.length,0);
    api.events.print("listeners");});
  it("get history",async () => {
    api.events.emit("test",13);
    J.arr(api.events.history);
    J.gt(api.events.history.length,0);
    api.events.print("history");});
  it("get values",async () => {
    J.true(api.events.values);
    J.gt(Object.keys(api.events.values).length,0);
    api.events.print("values");});
});