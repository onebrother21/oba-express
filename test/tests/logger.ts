import {J} from "../utils";
import fs from "fs";
import winston from "winston";
import {AppError} from "@onebro/oba-common";
import {OBACoreApi,OBACoreConfig,masterConfig} from "../../src";
import path from "path";

export const obaCoreLoggerInitTests = () => J.desc("AM Logger Init",() => {
  let m:OBACoreApi<null>,c:OBACoreConfig,logger:OBACoreApi<null>["logger"],logmsg:string;
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
    c = masterConfig("OBA_CORE");
    m = new OBACoreApi({logger:{...c.logger,dirname:path.join(__dirname,"/../../logs")}});
    J.is(m);
    J.true(m.logger);
    logger = m.logger});
  it(`has logging methods`,async () => {
    J.is(logger.access);
    J.is(logger.warn);
    J.is(logger.error);
    J.is(logger.info);
    J.is(logger.crit);
    J.is(logger.debug);});
  it(`has query methods`,async () => J.is(logger.query));
  it(`has logs directory`,async () => {
    const hasDir = fs.existsSync(m.config.logger.dirname);
    J.true(hasDir);});
  it(`makes log msg from error`,async () => {
    logmsg = logger.getMsg(e);
    J.is(logmsg);
    console.log(logmsg);});
  it(`writes log msg to file`,async () => logger.error(logmsg));
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
    logger.query(logQuery,cb);
  },1E9);
});