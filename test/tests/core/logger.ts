import {J} from "../../utils";
import fs from "fs";
import winston from "winston";
import {AppError} from "@onebro/OBA-common";
import {TestAppApi} from "../../test-app-api";

export const OBAExpressLoggerInitTests = () => J.utils.desc("AM Logger Init",() => {
  let api:TestAppApi,logmsg:string;
  const logQuery:winston.QueryOptions = {
    from:new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    until:new Date(),
    limit:10,
    start:0,
    order:'asc' as 'asc',
    fields: undefined//['message']
  };
  const e = new AppError({
    name:"UserInputError",
    message:"That won\'t work fam",
    //_message:"But seriously, all bad",
    //code:"WHOA",
    status:500,
    stack:"...stacktraces here"});
  it("init",async () => {
    api = (await J.utils.init("OBA_EXPRESS")).api;
    J.is(api);
    J.true(api.logger);
  });
  it(`has logging methods`,async () => {
    J.is(api.logger.access);
    J.is(api.logger.warn);
    J.is(api.logger.error);
    J.is(api.logger.info);
    J.is(api.logger.crit);
    J.is(api.logger.debug);});
  it(`has query methods`,async () => J.is(api.logger.query));
  it(`has logs directory`,async () => {
    const hasDir = fs.existsSync(api.config.logger.dirname);
    J.true(hasDir);});
  it(`makes log msg from error`,async () => {
    logmsg = api.logger.getMsg(e);
    J.is(logmsg);
    console.log(logmsg);});
  it(`writes log msg to file`,async () => api.logger.error(logmsg));
  it(`runs log query`,(done) => {
    const cb = (e:Error,results:any) => {
      if(e){
        console.error(e);
        throw e;}
      else{
        J.is(results);
        console.log(logQuery);
        console.log(results);
      }
      done();
    };
    api.logger.query(logQuery,cb);
  },1E9);
});