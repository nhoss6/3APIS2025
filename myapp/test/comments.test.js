import request from "supertest";
import app from "../app.js";
import mongoose from "mongoose";

let token = "";
let postId = "";
let commentId = "";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await request(app)
    .post("/users/login")
    .send({ email: "test@example.com", password: "123456" });
  token = user.body.token;

  const post = await request(app)
    .post("/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "Post avec commentaire", content: "Du contenu" });
  postId = post.body._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Commenting System", () => {
  test("POST /posts/:id/comments - should add a comment", async () => {
    const res = await request(app)
      .post(`/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Super article !" });
    expect(res.status).toBe(201);
    commentId = res.body._id;
  });

  test("GET /posts/:id/comments - should retrieve comments", async () => {
    const res = await request(app).get(`/posts/${postId}/comments`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("PATCH /posts/:id/comments/:commentId - should edit a comment", async () => {
    const res = await request(app)
      .patch(`/posts/${postId}/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ text: "Commentaire mis à jour" });
    expect(res.status).toBe(200);
  });
});
