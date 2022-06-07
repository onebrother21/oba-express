
/// <reference types="express" />

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {interface Request extends Flash {}}
interface Flash {
  flash(type: string, message: any): void;
  id?:string;
  appname?:string;
  appuser?:Partial<{
    ip:string;
    device:string;
    username:string;
    next:string;
    role:string;
    info:any;
    okto:string;
  }>;
  token:string;
  warning?:any;
  error?:any;}
declare module "express-flash";