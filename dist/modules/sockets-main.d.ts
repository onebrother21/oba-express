/// <reference types="node" />
import { Server } from "http";
import { OBAExpressApiSocketsType, OBAExpressApiSocketsConfig } from "./sockets-types";
export interface OBAExpressApiSockets<Sockets> extends OBAExpressApiSocketsType {
}
export declare class OBAExpressApiSockets<Sockets> {
    constructor(config: OBAExpressApiSocketsConfig<Sockets>, server: Server);
}
export default OBAExpressApiSockets;
export * from "./sockets-types";
