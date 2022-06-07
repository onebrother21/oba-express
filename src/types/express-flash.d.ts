
/// <reference types="express" />

// Add RequestValidation Interface on to Express's Request Interface.
declare namespace Express {interface Request extends Flash {}}
interface Flash {
  flash(type: string, message: any): void;
  id?:string;
  appname?:string;
  appuser?:Partial<{
    role:string;
    name:string;
    device:string;
    next:string;
    okto:string;
  }>;
  token:string;
  warning?:any;
  error?:any;}
declare module "express-flash";