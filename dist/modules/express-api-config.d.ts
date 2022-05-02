import { OBAExpressApiConfig } from "./express-api-main";
declare const setDefaultConfigWithEnvironment: <Sockets = undefined>() => OBAExpressApiConfig<Sockets>;
export { setDefaultConfigWithEnvironment as expressConfig };
