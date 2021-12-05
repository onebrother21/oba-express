import { OBAExpressApiConfig } from "./express-api-config-type";
declare const setDefaultConfigWithEnvironment: <Ev, Sockets>(prefix: string) => OBAExpressApiConfig<Ev, Sockets>;
export { setDefaultConfigWithEnvironment as expressConfig };
