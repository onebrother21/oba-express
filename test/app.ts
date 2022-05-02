import mongoose from "mongoose";
import supertest from "supertest";
import OB,{AnyBoolean} from "@onebro/oba-common";
import {testAppApiConfig} from "../src/dev";

export const App = {
  refresh:async () => {
    const {api} = await testAppApiConfig();
    if(OB.match(/mongodb\+srv/i,api.config.db.uri)) return;
    const db = await mongoose.createConnection(api.config.db.uri).asPromise();
    await db.dropDatabase();
  },
  init:async (withTestApp?:AnyBoolean) => {
    try{
      const {api} = await testAppApiConfig();
      await api.init(1);
      const app = supertest(api.app);
      return {api,...withTestApp?{app}:null};
    }
    catch(e){console.error(e);throw e;}
  }
};