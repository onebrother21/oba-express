
/// <reference types="express" />

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {interface Request extends Flash {}}
interface Flash {
  flash(type: string, message: any): void;
  id?:string;
  appname?:string;
  user?:any;
  device?:any;
  role?:any;
  ipdata?:any;
  token?:any;
  warning?:any;
  error?:any;}
declare module "express-flash";