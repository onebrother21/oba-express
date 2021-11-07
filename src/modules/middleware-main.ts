import {OBAExpressApiMiddlewareType} from "./middleware-types";
import { getMiddlewares } from "./middleware-setters";

export interface OBAExpressApiMiddleware<Ev,Sockets> extends OBAExpressApiMiddlewareType<Ev,Sockets> {}
export class OBAExpressApiMiddleware<Ev,Sockets> {constructor(){Object.assign(this,getMiddlewares<Ev,Sockets>());}}
export default OBAExpressApiMiddleware;