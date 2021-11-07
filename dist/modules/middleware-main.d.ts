import { OBAExpressApiMiddlewareType } from "./middleware-types";
export interface OBAExpressApiMiddleware<Ev, Sockets> extends OBAExpressApiMiddlewareType<Ev, Sockets> {
}
export declare class OBAExpressApiMiddleware<Ev, Sockets> {
    constructor();
}
export default OBAExpressApiMiddleware;
