import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

let token = "";
let postId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  // Login user (crée ou récupère un JWT)
  const res = await request(app)
    .post("/users/login")
    .send({ email: "test@example.com", password: "123456" });
  token = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Blog Posts", () => {
  test("POST /posts - should create a new post", async () => {
    const res = await request(app)
      .post("/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Mon premier post", content: "Hello world!" });

    expect(res.status).toBe(201);
    postId = res.body._id;
  });

  test("GET /posts/:id - should retrieve the post", async () => {
    const res = await request(app).get(`/posts/${postId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("title", "Mon premier post");
  });
});
