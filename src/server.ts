import {testAppApiConfig} from "./dev";
import OB from "@onebro/oba-common";

module.exports = (async () => {
  try{
    const {api} = await testAppApiConfig();
    await api.init(1,1);
  }
  catch(e){OB.error(e);throw e;}
})();