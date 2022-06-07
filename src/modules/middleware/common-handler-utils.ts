import jwt from "jsonwebtoken";
import OB,{Values,Strings} from "@onebro/oba-common";

export const mapUserRole = <R extends Strings>(roles:R,role?:Values<R>) => {
  const keys = OB.props(roles);
  if(!role) return keys[0];
  else return keys.find(r => roles[r] == role);
};
export const generateTkn = (payload:any,secret:string,opts?:any) => jwt.sign(payload,secret,opts);
export const verifyTkn = (token:string,secret:string) => jwt.verify(token,secret);