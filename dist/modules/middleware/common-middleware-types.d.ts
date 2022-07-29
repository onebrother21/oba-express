import { AnyBoolean } from "@onebro/oba-common";
export declare type MorganOpts = Partial<Record<"useDev" | "useLogger", boolean>>;
export declare type CookieParserOpts = {
    secret?: string;
};
export declare type MongoSessionStoreOpts = {
    mongoUrl: string;
    collectionName?: string;
    autoRemove?: "native" | "interval" | "disabled";
    autoRemoveInterval?: number;
    autoReconnect?: boolean;
    touchAfter: 86400;
    stringify: boolean;
};
export declare type SessionOpts = {
    name: string;
    secret: string | string[];
    resave?: boolean;
    saveUninitialized?: boolean;
    cookie?: {
        maxAge: number;
    };
    store?: MongoSessionStoreOpts;
};
export declare type CsrfOpts = {
    cookie: boolean;
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
export declare type CorsOpts = {
    whitelist: string[];
    preflightContinue: boolean;
    credentials: boolean;
    allowedHeaders: string[];
    methods: string[];
    maxAge: number;
    blacklist?: string[];
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
export declare type UseStaticOpts = {
    maxAge: 3000000;
    dirname: string;
};
export declare type UseViewsOpts = {
    engine: string;
    dirname: string;
};
export declare type OBAExpressCommonMiddlewareConfig = Partial<{
    compression: AnyBoolean;
    disablePoweredBy: AnyBoolean;
    morgan: MorganOpts;
    flash: AnyBoolean;
    cookieParser: CookieParserOpts;
    lusca: LuscaOpts;
    helmet: HelmetOpts;
    csrf: CsrfOpts;
    session: SessionOpts;
    cors: CorsOpts;
    bodyParser: BodyParserOpts;
    useStatic: UseStaticOpts;
    useViews: UseViewsOpts;
    errorhandler: AnyBoolean;
    pageNotFound: null;
    finalHandler: null;
}>;
