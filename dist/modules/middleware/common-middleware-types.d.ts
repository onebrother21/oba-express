import { AnyBoolean } from "@onebro/oba-common";
import { ApiUserID } from "../vars";
export declare type PublicOpts = {
    maxAge: 3000000;
    dirname: string;
};
export declare type ViewsOpts = {
    engine: string;
    dirname: string;
};
export declare type MorganOpts = {
    useDev?: boolean;
    useLogger?: boolean;
};
export declare type CorsOpts = {
    origins: string[];
    preflightContinue: boolean;
    credentials: boolean;
    allowedHeaders: string[];
    methods: string[];
    maxAge: number;
};
export declare type CorsValidationParams = {
    origin: string;
    origins: string[];
    blacklist?: string | ApiUserID[];
};
export declare type CookieParserOpts = {
    secret?: string;
};
export declare type MongoStoreOpts = {
    mongoUrl: string;
    collectionName?: string;
    autoRemove?: "native" | "interval" | "disabled";
    autoRemoveInterval?: number;
    autoReconnect?: boolean;
};
export declare type SessionOpts = {
    name: string;
    secret: string;
    resave?: boolean;
    saveUninitialized?: boolean;
    cookie?: {
        maxAge: number;
    };
    store?: MongoStoreOpts;
};
export declare type JwtOpts = {
    secret: string;
};
export declare type LuscaOpts = {
    csrf?: boolean | {
        cookie?: string | any;
    };
    csp?: any;
    xframe?: "SAMEORIGIN" | string;
    p3p?: string;
    hsts?: {
        maxAge: number;
        includeSubDomains: boolean;
        preload: boolean;
    };
    xssProtection?: boolean;
    nosniff?: boolean;
    referrerPolicy?: "same-origin" | string;
};
export declare type CsrfOpts = {
    cookie: boolean;
};
export declare type HelmetOpts = {
    csrf?: boolean | {
        cookie?: string | any;
    };
    csp?: any;
    xframe?: "SAMEORIGIN" | string;
    p3p?: string;
    hsts?: {
        maxAge: number;
        includeSubDomains: boolean;
        preload: boolean;
    };
    xssProtection?: boolean;
    nosniff?: boolean;
    referrerPolicy?: "same-origin" | string;
};
export declare type BodyParserOpts = {
    json?: {
        limit?: string;
    };
    urlencoded?: {
        extended?: boolean;
    };
    raw?: {
        type?: string;
        limit?: string;
    };
};
export declare type PassportOpts = {};
export declare type OBAExpressCommonMiddlewareConfig = Partial<{
    disablePoweredBy: AnyBoolean;
    flash: AnyBoolean;
    errorhandler: AnyBoolean;
    compression: AnyBoolean;
    public: PublicOpts;
    views: ViewsOpts;
    morgan: MorganOpts;
    cors: CorsOpts;
    bodyParser: BodyParserOpts;
    cookieParser: CookieParserOpts;
    session: SessionOpts;
    lusca: LuscaOpts;
    helmet: HelmetOpts;
    csrf: CsrfOpts;
    passport: PassportOpts;
    pageNotFound: null;
    finalHandler: null;
}>;
