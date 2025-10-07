import mongoose from "mongoose";
import Product from "../models/Product.js";
import assert from "assert";

describe("MongoDB test", function() {
  before(async function() {
    await mongoose.connect("mongodb://127.0.0.1:27017/testDB");
  });

  after(async function() {
    await mongoose.connection.close();
  });

  it("should create and retrieve a product", async function() {
    const p = new Product({ name: "Mouse", price: 19.9, stock: 30 });
    await p.save();

    const found = await Product.findOne({ name: "Mouse" });
    assert.strictEqual(found.price, 19.9);
  });
});
