import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../app.js";
import Product from "../models/Product.js";

describe("API /products", function () {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  beforeEach(async function () {
    await Product.deleteMany({});
  });

  after(async function () {
    await mongoose.connection.close();
  });

  it("✅ POST /products - should create a valid product", async function () {
    const res = await request(app)
      .post("/products")
      .send({ name: "Keyboard", price: 49.9, stock: 100 })
      .expect(201);
    expect(res.body).to.have.property("_id");
  });

  it("❌ POST /products - should reject invalid data", async function () {
    const res = await request(app)
      .post("/products")
      .send({ name: 123 }) // invalid: not a string, price missing
      .expect(400);
    expect(res.body.message).to.include("name");
  });

  it("✅ GET /products - should return all products", async function () {
    await Product.create({ name: "Mouse", price: 29.9 });
    const res = await request(app).get("/products").expect(200);
    expect(res.body).to.be.an("array").that.is.not.empty;
  });

  it("❌ GET /products/:id - should return 404 if not found", async function () {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/products/${fakeId}`).expect(404);
    expect(res.body.message).to.include("not found");
  });

  it("✅ PATCH /products/:id - should update a product", async function () {
    const product = await Product.create({ name: "Monitor", price: 199.9 });
    const res = await request(app)
      .patch(`/products/${product._id}`)
      .send({ price: 149.9 })
      .expect(200);
    expect(res.body.price).to.equal(149.9);
  });

  it("✅ DELETE /products/:id - should delete a product", async function () {
    const product = await Product.create({ name: "Headset", price: 79.9 });
    const res = await request(app).delete(`/products/${product._id}`).expect(200);
    expect(res.body.message).to.include("deleted");
  });
});
