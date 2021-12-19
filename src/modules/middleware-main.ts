import { getCommonMiddlewares } from "./middleware-setters";

export class OBAExpressApiMiddleware {static init = () => getCommonMiddlewares();}
export default OBAExpressApiMiddleware;