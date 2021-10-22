import {J} from "../utils";
import {OBACoreApi,OBACoreConfig,masterConfig} from "../../src";

export const obaCoreErrorFactoryInitTests = () => J.desc("AM Errors Init",() => {
  let m:OBACoreApi<null>,c:OBACoreConfig,e:OBACoreApi<null>["e"];
  it("init",async () => {
    c = masterConfig("OBA_CORE");
    m = new OBACoreApi({errors:c.errors});
    J.is(m);
    J.true(m.e);
    e = m.e;});
  it("404",async () => {
    J.error(e.notfound());
    console.error(e.notfound().message);});
  it("Cors",async () => {
    J.error(e.cors());
    console.error(e.cors().message);});
  it("existing data",async () => {
    J.error(e.existing("data"));
    console.error(e.existing("data").message);});
  it("data not found",async () => {
    J.error(e.doesNotExist("user"));
    console.error(e.doesNotExist("user").message);});
  it("invalid data",async () => {
    J.error(e.invalid("api credentials"));
    console.error(e.invalid("api credentials").message);});
  it("missing data",async () => {
    J.error(e.missing("handle"));
    console.error(e.missing("handle").message);});
  it("data mismatch",async () => {
    J.error(e.mismatch("pin"));
    console.error(e.mismatch("pin").message);});
  it("csrf",async () => {
    J.error(e.map(new Error("CSRF")));
    console.error(e.map(new Error("CSRF")).message);});
  it("req validation",async () => {
    J.error(e.map(new Error("ValidationErr")));
    console.error(e.map(new Error("validation")).message);});
  it("cast error",async () => {
    J.error(e.map(new Error("castError")));
    console.error(e.map(new Error("castError")).message);});
  it("some random error",async () => {
    const test = e.map(new Error("sdihfifhsoif"));
    J.error(test);
    console.error(test.message);
    console.error(test.info);});
});