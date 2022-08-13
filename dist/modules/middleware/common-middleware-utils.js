"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readCert = exports.validateCORS = exports.morganMsgFormats = exports.morganMsgTokens = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
//import multer from "multer";
//import { GridFsStorage } from "multer-gridfs-storage";
const oba_common_1 = __importDefault(require("@onebro/oba-common"));
exports.morganMsgTokens = {
    errLogMsg: (req) => {
        const msg = {
            id: req.id,
            //ts:new Date().toLocaleString("en-US",OB.locals.dateFormat as any),
            name: req.error ? req.error.name : "",
            msg: req.error ? req.error.message : "",
            stack: req.error ? req.error.stack : "",
        };
        req.error && req.error.warning ? msg.warning = req.error.warning : null;
        req.error && req.error.code ? msg.code = req.error.code : null;
        req.error && req.error.info ? msg.info = req.error.info : null;
        req.error && req.error.errors ? msg.errors = req.error.errors : null;
        return JSON.stringify(msg);
    },
    time: () => new Date().toLocaleString("en-US", oba_common_1.default.locals.dateFormat),
    appuser: (req) => ((req.appuser) || {}).username,
    hostname: (req) => req.headers["host"] || req.hostname,
    reqid: (req) => req.id || "",
    contentType: (req) => req.headers["content-type"],
    headers: (req) => req.headers ? JSON.stringify(req.headers) : "",
    query: (req) => req.query ? JSON.stringify(req.query) : "",
    params: (req) => req.params ? JSON.stringify(req.params) : "",
    body: (req) => req.body ? JSON.stringify(req.body) : "",
};
const accessTokenStrs = {
    id: `"id":":reqid"`,
    host: `"host":":hostname"`,
    ip: `"ip":":remote-addr"`,
    user: `"user":":appuser"`,
    referrer: `"referrer":":referrer"`,
    agent: `"agent":":user-agent"`,
    http: `"http":":http-version"`,
    method: `"method":":method"`,
    path: `"url":":url"`,
    resStatus: `"status":":status"`,
    resSize: `"res-size":":res[content-length]"`,
    resTime: `"res-time":":total-time"`,
};
const accessLogMsg = "{" + Object.keys(accessTokenStrs).map(k => accessTokenStrs[k]).join(",") + "}";
exports.morganMsgFormats = {
    access: accessLogMsg,
    warn: `:errLogMsg`,
    error: `:errLogMsg`,
};
const validateCORS = (origin, whitelist) => {
    // allow requests with no origin, like mobile apps or curl requests? -> NO UNTIL FURTHER GUIDANCE
    if (!origin)
        return false;
    if (whitelist)
        for (let i = 0, l = whitelist.length; i < l; i++)
            if (oba_common_1.default.match(new RegExp(whitelist[i]), origin))
                return true;
    return false;
};
exports.validateCORS = validateCORS;
const readCert = () => {
    const certFile = path_1.default.resolve(__dirname, "ssl/client.crt");
    const keyFile = path_1.default.resolve(__dirname, "ssl/client.key");
    const caFile = path_1.default.resolve(__dirname, "ssl/ca.cert.pem");
    const SSLCertInfo = {
        cert: fs_1.default.readFileSync(certFile),
        key: fs_1.default.readFileSync(keyFile),
        passphrase: "password",
        ca: fs_1.default.readFileSync(caFile)
    };
    return SSLCertInfo;
};
exports.readCert = readCert;
/*
export const loadMulterGfsSingle = ({dbUrl,fileSlug,bucketName}:MulterGfsOpts,multiple?:boolean) => {
  const {generateBytes} = GridFsStorage;
  const storage = new GridFsStorage({
    url:dbUrl,
    options:{useNewUrlParser:true,useUnifiedTopology:true},
    cache:true,
    file:(req,file) => {
      return new Promise(done => {
        const fileTypes = ["image/png","image/jpeg","image/jpg"];
        const filename = `${Date.now()}-${fileSlug}-${file.originalname}`;
        //const filename = await generateBytes().filename + path.extname(file.originalname);
        done(!fileTypes.includes(file.mimetype)?filename:{bucketName,filename});
      });
    }
  });
  const uploadFiles = multiple?multer({storage}).single("file"):multer({storage}).array("file",10);;
  const uploadFilesHandler = util.promisify(uploadFiles);
  return uploadFilesHandler;
};
*/ 
//# sourceMappingURL=common-middleware-utils.js.map