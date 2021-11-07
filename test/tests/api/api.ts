import {J,ResponseData} from "../../utils";
import {SuperTest,Test,Response} from "supertest";

export const OBAExpressApiTests = () => J.utils.desc("OBA EXPRESS TEST API",() => {
  let app:SuperTest<Test>,data:ResponseData = J.utils.newResponseData();
  it("init w/o errors",async () => {
    app = (await J.utils.init("OBA_EXPRESS",true)).app;
    J.is(app);
  },1E9);                    
  it("Home: GET / [403 - No Origin]",async () => {
    await app
    .get("/")
    .expect(403)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/cors/i.test(res.body.message));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Home: GET / [403 - Bad Origin]",async () => {
    await app
    .get("/")
    .set("Origin","https://oihihih.com")
    .expect(403)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/cors/i.test(res.body.message));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Home: GET / [200 - Origin & Cookies OK]",async () => {
    await app
    .get("/")
    .set("Origin","https://oba-dev-apps.com")
    .expect(200)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.is(data.cookies["_bc_0"]);
      J.is(data.cookies["_somesession"]);
      J.is(data.cookies["_csrf"]);
      J.is(data.cookies["XSRF-TOKEN"]);
      //console.log(data);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Test: GET /test-only [200 - Resource OK]",async () => {
    await app
    .get("/test-only")
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",data.cookieArr)
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.is(res.body.ready);
      J.utils.handleResponse(data,res);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Test1: GET /test-only1 [404 - Resource Not Found]",async () => {
    await app
    .get("/test-only1")
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",data.cookieArr)
    .expect("Content-Type",/json/)
    .expect(404)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/not found/.test(res.body.message));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9); 
  it("Test: POST /test-only [403 - Missing CSRF]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("Cookie",data.cookieArr)
    .expect("Content-Type",/json/)
    .expect(403)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/access denied/i.test(res.body.message));
      J.true(/csrf/i.test(res.body.info));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [403 - Bad CSRF]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN","snickerdoodle")
    .set("Cookie",data.cookieArr)
    .expect("Content-Type",/json/)
    .expect(403)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/access denied/i.test(res.body.message));
      J.true(/csrf/i.test(res.body.info));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [422 - Req Validation - Body Missing Prop]",async () => {
    await app
    .post("/test-only")
    .send({admi:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN",data.csrfToken)
    .set("Cookie",data.cookieArr)
    .set("Accept","application/json")
    .expect("Content-Type",/json/)
    .expect(422)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/Check data/.test(res.body.message));
      J.true(/invalid/i.test(res.body.errors[0].admin));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [422 - Req Validation - Body Invalid Prop]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth1"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN",data.csrfToken)
    .set("Cookie",data.cookieArr)
    .set("Accept","application/json")
    .expect("Content-Type",/json/)
    .expect(422)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/Check data/.test(res.body.message));
      J.true(/invalid/i.test(res.body.errors[0].admin));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Test: POST /test-only [200 - CSRF & Req Validation OK]",async () => {
    await app
    .post("/test-only")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("XSRF-TOKEN",data.csrfToken)
    .set("Cookie",data.cookieArr)
    .set("Accept","application/json")
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      console.log(res.body);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-only [401 - No Api Creds]",async () => {
    await app
    .get("/oba-express/v1/en/test-only")
    .set("Origin","https://oba-dev-apps.com")
    .expect(401)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/not provided/i.test(res.body.message));
      J.true(/cred/i.test(res.body.message));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-only [401 - Bad Api Creds]",async () => {
    await app
    .get("/oba-express/v1/en/test-only")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-CLIENT-ID","00-obA-express")
    .set("OBA-CLIENT-KEY","uenuvenv")
    .expect(401)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      J.true(/invalid/i.test(res.body.message));
      J.true(/cred/i.test(res.body.message));
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-only [200 - Api Creds OK]",async () => {
    await app
    .get("/oba-express/v1/en/test-only")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-CLIENT-ID","00-obA-express")
    .set("OBA-CLIENT-KEY","1873487748")
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.is(res.body.ready);
      J.utils.handleResponse(data,res);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Api Test: POST /oba-express/v1/en/test-only [200 - Get Tkn]",async () => {
    await app
    .post("/oba-express/v1/en/test-only")
    .send({admin:"ObAuth"})
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-CLIENT-ID","00-obA-express")
    .set("OBA-CLIENT-KEY","1873487748")
    .set("XSRF-TOKEN",data.csrfToken)
    .set("Cookie",data.cookieArr)
    .set("Accept","application/json")
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
      console.log(res.body);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-tkn [401 - No Tkn]",async () => {
    await app
    .get("/oba-express/v1/en/test-tkn")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-CLIENT-ID","00-obA-express")
    .set("OBA-CLIENT-KEY","1873487748")
    .expect("Content-Type",/json/)
    .expect(401)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-tkn [401 - Bad Tkn]",async () => {
    await app
    .get("/oba-express/v1/en/test-tkn")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-CLIENT-ID","00-obA-express")
    .set("OBA-CLIENT-KEY","1873487748")
    .set("Authorization","Bobo "+data.authToken)
    .expect("Content-Type",/json/)
    .expect(401)
    .expect((res:Response) => {
      J.utils.handleResponse(data,res);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
  it("Api Test: GET /oba-express/v1/en/test-tkn [200 - Auth Tkn OK]",async () => {
    await app
    .get("/oba-express/v1/en/test-tkn")
    .set("Origin","https://oba-dev-apps.com")
    .set("OBA-CLIENT-ID","00-obA-express")
    .set("OBA-CLIENT-KEY","1873487748")
    .set("Authorization","Bearer "+data.authToken)
    .expect("Content-Type",/json/)
    .expect(200)
    .expect((res:Response) => {
      J.is(res.body.token);
      J.utils.handleResponse(data,res);
    })
    .catch(e => {console.error(e);throw e;});
  },1E9);
});