export interface SendReqAuthOptions {
    user?: string;
    username?: string;
    pass?: string;
    password?: string;
    sendImmediately?: boolean;
    bearer?: string | (() => string);
}
export interface SendReqOpts {
    url: string;
    method: "get" | "put" | "post" | "delete";
    headers?: {
        [key: string]: string;
    };
    auth?: SendReqAuthOptions;
    ssl?: boolean;
    form?: {
        [key: string]: any;
    };
    body: any;
}
export declare const sendRequest: <T>(o: SendReqOpts) => Promise<T>;
export declare type OBNotificationData = {
    method: string;
    type: string;
    user: string;
    data: any;
};
export declare const notifyApiUser: (o: OBNotificationData, doSend?: boolean | number) => Promise<boolean>;
