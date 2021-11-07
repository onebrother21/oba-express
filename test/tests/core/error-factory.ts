import {J} from "../../utils";
import {TestAppApi} from "../../test-app-api";

export const OBAExpressErrorFactoryInitTests = () => J.utils.desc("AM Errors Init",() => {
  let api:TestAppApi;
  it("init",async () => {
    api = (await J.utils.init("OBA_EXPRESS")).api;
    J.is(api);
    J.true(api.e);
  });
  it("404",async () => {
    J.error(api.e.notfound());
    console.error(api.e.notfound().message);
  });
  it("Cors",async () => {
    J.error(api.e.cors());
    console.error(api.e.cors().message);});
  it("existing data",async () => {
    J.error(api.e.existing("data"));
    console.error(api.e.existing("data").message);});
  it("data not found",async () => {
    J.error(api.e.doesNotExist("user"));
    console.error(api.e.doesNotExist("user").message);});
  it("invalid data",async () => {
    J.error(api.e.invalid("api credentials"));
    console.error(api.e.invalid("api credentials").message);});
  it("missing data",async () => {
    J.error(api.e.missing("handle"));
    console.error(api.e.missing("handle").message);});
  it("data mismatch",async () => {
    J.error(api.e.mismatch("pin"));
    console.error(api.e.mismatch("pin").message);});
  it("csrf",async () => {
    J.error(api.e.map(new Error("CSRF")));
    console.error(api.e.map(new Error("CSRF")).message);});
  it("req validation",async () => {
    J.error(api.e.map(new Error("ValidationErr")));
    console.error(api.e.map(new Error("validation")).message);});
  it("cast error",async () => {
    J.error(api.e.map(new Error("castError")));
    console.error(api.e.map(new Error("castError")).message);});
  it("some random error",async () => {
    const test = api.e.map(new Error("sdihfifhsoif"));
    J.error(test);
    console.error(test.message);
    console.error(test.info);});
});