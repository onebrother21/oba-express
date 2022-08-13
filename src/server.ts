import {testAppApiConfig} from "./dev-server";
import OB from "@onebro/oba-common";

module.exports = (async () => {
  try{
    const {api} = await testAppApiConfig();
    await api.init(1,1);
  }
  catch(e){OB.error(e);throw e;}
})();