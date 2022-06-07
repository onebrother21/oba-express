import { OBAExpressConfig } from "./main";
declare const setDefaultConfigWithEnvironment: <Sockets = undefined>() => OBAExpressConfig<Sockets>;
export { setDefaultConfigWithEnvironment as expressConfig };
