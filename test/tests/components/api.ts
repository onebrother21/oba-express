import {J,ResponseData} from "../../utils";
import {App} from "../../app";
import {SuperTest,Test,Response} from "supertest";
import OB from "@onebro/oba-common";

export const OBAExpressInitTests = () => J.desc("OBA EXPRESS TEST API",() => {
  let app:SuperTest<Test>,res_:ResponseData = J.newResponseData();
  it("init w/o errors",async () => {
    await App.refresh();
    const {app:app_} = await App.init(true);
    app = app_ as SuperTest<Test>;
    J.is(app);
  },1E9);                    
  it("Home: GET / [403 - No Origin]",async () => {
    await app
    .get("/")
    .expect(403)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/cors/i.test(res.body.message));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Home: GET / [403 - Bad Origin]",async () => {
    await app
    .get("/")
    .set("Origin","https://oihihih.com")
    .expect(403)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/cors/i.test(res.body.message));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Home: GET / [200 - Origin OK, Cookies OK, Home Page OK]",async () => {
    await app
    .get("/")
    .set("Origin","https://oba-dev-apps.com")
    .expect("Content-Type",/text\/html/)
    .expect(200)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.is(res_.cookies["_bc_0"]);
      J.is(res_.cookies["_csrf"]);
      J.is(res_.cookies["XSRF-TOKEN"]);
      J.is(res_.cookies["oba-c5365c02"]);
      J.has(res.text,`Hello, World!`);
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Test: GET /sample [200 - Sample (Page 0) OK]",async () => {
    await app
    .get("/sample")
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/text\/html/)
    .expect(200)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.has(res.text,`You are logged in as`);
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Test: GET /test-only [200 - Resource OK]",async () => {
    await app
    .get("/test-only")
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.is(res_.body.data.ready);
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Test1: GET /test-only1 [404 - Resource Not Found]",async () => {
    await app
    .get("/test-only1")
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(404)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/not found/.test(res_.body.message));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Error: GET /error [500 - Holy Shit, **check db error_log for record**]",async () => {
    await app
    .get("/error")
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(500)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/holy shit/.test(res_.body.message));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9); 
  it("Test: POST /test-only [403 - Missing CSRF]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(403)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/access denied/i.test(res_.body.message));
      J.true(/csrf/i.test(res_.body.info));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [403 - Bad CSRF]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",res_.cookieArr)
    .set("XSRF-TOKEN","snickerdoodle")
    .expect("Content-Type",/json/)
    .expect(403)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/access denied/i.test(res_.body.message));
      J.true(/csrf/i.test(res_.body.info));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [400 - Req Validation - Body Missing Prop]",async () => {
    await app
    .post("/test-only")
    .send({admi:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .set("Accept","application/json")
    .expect("Content-Type",/json/)
    .expect(400)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/Check data/.test(res_.body.message));
      J.true(/invalid/i.test(res_.body.errors[0].admin));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [400 - Req Validation - Body Invalid Prop]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth1"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .set("Accept","application/json")
    .expect("Content-Type",/json/)
    .expect(400)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/Check data/.test(res_.body.message));
      J.true(/invalid/i.test(res_.body.errors[0].admin));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [200 - CSRF & Req Validation OK]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .set("Accept","application/json")
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.is(res_.body.data.config);
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Api Test: POST /oba-express/v1/en/test-tkn [401 - No Api Creds]",async () => {
    await app
    .post("/oba-express/v1/en/test-tkn")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .expect(401)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/invalid/i.test(res_.body.message));
      J.true(/cred/i.test(res_.body.message));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Api Test: POST /oba-express/v1/en/test-tkn [401 - Bad Api Creds]",async () => {
    await app
    .post("/oba-express/v1/en/test-tkn")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-EXPRESS-CLIENT-ID","oba-8c351ebf")
    .set("OBA-EXPRESS-CLIENT-KEY","uenuvenv")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .expect(401)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.true(/invalid/i.test(res_.body.message));
      J.true(/cred/i.test(res_.body.message));
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Api Test: POST /oba-express/v1/en/test-tkn [200 - Api Creds OK, Get Auth Tkn, Get Auth Cookie]",async () => {
    await app
    .post("/oba-express/v1/en/test-tkn")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-EXPRESS-CLIENT-ID","oba-8c351ebf")
    .set("OBA-EXPRESS-CLIENT-KEY","dbb0fe3d-5105-7c50-9261-8deece24c73c")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.is(res_.cookies["oba-53fcad3c"]);
      J.is(res_.authToken);
      J.is(res_.body.data.test,15);
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-tkn [401 - No Tkn]",async () => {
    await app
    .get("/oba-express/v1/en/test-tkn")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-EXPRESS-CLIENT-ID","oba-8c351ebf")
    .set("OBA-EXPRESS-CLIENT-KEY","dbb0fe3d-5105-7c50-9261-8deece24c73c")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(401)
    .expect((res:Response) => {J.handleResponse(res_,res);})
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-tkn [401 - Bad Tkn]",async () => {
    await app
    .get("/oba-express/v1/en/test-tkn")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-EXPRESS-CLIENT-ID","oba-8c351ebf")
    .set("OBA-EXPRESS-CLIENT-KEY","dbb0fe3d-5105-7c50-9261-8deece24c73c")
    .set("Authorization","Bobo "+res_.authToken)
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(401)
    .expect((res:Response) => {J.handleResponse(res_,res);})
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-tkn [401 - Bad Tkn #2]",async () => {
    await app
    .get("/oba-express/v1/en/test-tkn")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-EXPRESS-CLIENT-ID","oba-8c351ebf")
    .set("OBA-EXPRESS-CLIENT-KEY","dbb0fe3d-5105-7c50-9261-8deece24c73c")
    .set("Authorization","Bearer snickerdoodle")
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(401)
    .expect((res:Response) => {J.handleResponse(res_,res);})
    .catch(e => {OB.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-tkn [200 - Auth Tkn OK]",async () => {
    await app
    .get("/oba-express/v1/en/test-tkn")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-EXPRESS-CLIENT-ID","oba-8c351ebf")
    .set("OBA-EXPRESS-CLIENT-KEY","dbb0fe3d-5105-7c50-9261-8deece24c73c")
    .set("Authorization","Bearer "+res_.authToken)
    .set("XSRF-TOKEN",res_.csrfToken)
    .set("Cookie",res_.cookieArr)
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.handleResponse(res_,res);
      J.is(res_.cookies["oba-53fcad3c"]);
      J.is(res_.authToken);
      J.is(res_.body.data.test,11);
      OB.log(res_.cookies,res_.body);
    })
    .catch(e => {OB.error(e);throw e;});
  },1E9);
});