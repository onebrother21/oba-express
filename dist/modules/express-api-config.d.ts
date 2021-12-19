import { OBAExpressApiConfig } from "./express-api-main";
declare const setDefaultConfigWithEnvironment: <Sockets = undefined>(prefix: string) => OBAExpressApiConfig<Sockets>;
export { setDefaultConfigWithEnvironment as expressConfig };
