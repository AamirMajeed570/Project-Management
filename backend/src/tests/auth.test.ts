import request from "supertest";
import app from "../app";

describe("Auth API", () => {

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "newuser@test.com", password: "Test@123" });

    expect(res.status).toBe(201);
    expect(res.body.email).toBe("newuser@test.com");
    expect(res.body).toHaveProperty("_id");
  });

  it("should not register an existing user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "duplicate@test.com", password: "Test@123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "duplicate@test.com", password: "Test@123" });

    expect(res.status).toBe(400); // Or your error code
    expect(res.body.message).toMatch(/already exists/i);
  });

  it("should login a registered user", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "loginuser@test.com", password: "Test@123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "loginuser@test.com", password: "Test@123" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with wrong password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email: "wrongpass@test.com", password: "Test@123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "wrongpass@test.com", password: "WrongPass123" });

    expect(res.status).toBe(401); // Unauthorized
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("should get user profile with valid token", async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({ email: "profile@test.com", password: "Test@123" });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "profile@test.com", password: "Test@123" });

    const token = loginRes.body.token;

    const res = await request(app)
      .get("/api/auth/profile")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe("profile@test.com");
  });

});
