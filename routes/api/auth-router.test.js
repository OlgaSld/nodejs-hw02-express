import mongoose from "mongoose";
import request from "supertest";

import app from "../../app.js";

import User from "../../models/User.js";

const { DB_TEST_HOST } = process.env;

describe("test /api/users.login route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_TEST_HOST);
    server = app.listen(3000);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany();
  });

  test("test /api/users/login with loginData", async () => {
    const loginData = {
      email: "olga@gmail.com",
      password: "1234567",
    };

    const { body, statusCode } = await request(app)
      .post("/api/users/login")
      .send(loginData);

    expect(statusCode).toBe(200);
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe("string");
    expect(body.user && typeof body.user === "object").toBe(true);
    expect(body.user.email).toBe(loginData.email);
    expect(typeof body.user.email).toBe("string");
    expect(body.user.subscription).toBeDefined();
    expect(typeof body.user.subscription).toBe("string");
  });
});
