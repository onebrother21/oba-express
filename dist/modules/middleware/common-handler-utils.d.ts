import jwt from "jsonwebtoken";
import { Values, Strings } from "@onebro/oba-common";
export declare const mapUserRole: <R extends Strings<undefined>>(roles: R, role?: Values<R>) => string;
export declare const generateTkn: (payload: any, secret: string, opts?: any) => string;
export declare const verifyTkn: (token: string, secret: string) => string | jwt.JwtPayload;
