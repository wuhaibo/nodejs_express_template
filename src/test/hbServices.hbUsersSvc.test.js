var hbUsersSvc = require("../hbServices/hbUsersSvc");

describe("test driven develop: hbutils.hbpostsSvc", () => {
  // init work before test
  beforeEach(() => {
    jest.setTimeout(10000);
  });

  // use async await to test
  test("fetchPosts develop", async () => {
    try {
      const data = await hbUsersSvc.fetchUserlist();
      expect(data.length).toBeGreaterThan(1);
    } catch (error) {
      console.log(error);
    }
  });
});
