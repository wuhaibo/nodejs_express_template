/* eslint-disable no-unused-vars */
const request = require("supertest");
const app = require("../app");
// eslint-disable-next-line no-unused-vars
const axios = require("axios");
const auth = require("../common/auth");
jest.mock("axios");

describe("Test the users login route", () => {
  // init work before test
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  test("It should successfully login", function (done) {
    request(app)
      .post("/users/login")
      .send({ username: "test", password: "test" })
      .expect(200)
      .then((res) => {
        expect(res.body.responseCode).toBe(0);
        done();
      })
      .catch((err) => done(err));
  });
});
