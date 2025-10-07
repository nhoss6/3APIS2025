// myapp/test/product.test.js
import { expect } from "chai";
import { calculateDiscountedPrice } from "../utils/productUtils.js";

describe("calculateDiscountedPrice", function() {
  it("calcule correctement une réduction de 20%", function() {
    const result = calculateDiscountedPrice(100, 20);
    expect(result).to.equal(80);
  });

  it("lève une erreur si les valeurs ne sont pas numériques", function() {
    expect(() => calculateDiscountedPrice("100", 20)).to.throw();
  });
});
