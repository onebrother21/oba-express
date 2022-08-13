import mongoose from "mongoose";
import supertest from "supertest";
import OB,{AnyBoolean} from "@onebro/oba-common";
import {testAppApiConfig} from "../src/dev-server";

export const App = {
  refresh:async () => {
    const {api} = await testAppApiConfig();
    if(api.config.db){
      try {
        OB.log(`dropping MongoDB database`);
        const {uri,opts} = api.config.db;
        if(OB.match(/mongodb\+srv/,uri)) return;
        const db = mongoose.createConnection(uri,opts);
        await db.dropDatabase();
      }
      catch(e){
        OB.warn(`MongoDB connection failed -> ${e.message||e}`);
      }
    }
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