const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const auth = require("../common/auth");
jest.mock("axios");
jest.mock("../common/auth");

describe("Test the protected routes in users.", () => {
  // init work before test
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  test("It should response the user list successfully.", async () => {
    // prepare
    const users = [{ id: 1, name: "Bob" }];
    const resp = { data: users };
    axios.get.mockResolvedValueOnce(resp);
    auth.authenticate.mockImplementation(async (req, res, next) => {
      next();
    });

    // action
    var response = await request(app).get("/users");

    // assert
    expect(response.statusCode).toBe(200);
    expect(response.body.responseCode).toBe(0);
  });
});
