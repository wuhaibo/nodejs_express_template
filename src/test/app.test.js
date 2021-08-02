const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
  // init work before test
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  // test using done function
  test("Done function: It should response the GET method.", (done) => {
    request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });

  // use promise way to test
  test("Promise way: It should response the GET method", () => {
    return request(app)
      .get("/")
      .then((response) => {
        expect(response.statusCode).toBe(200);
      });
  });

  // use async await to test
  test("Async and Await: It should response the GET method", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
  });
});
