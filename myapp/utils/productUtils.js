
export function calculateDiscountedPrice(price, discount) {
  if (typeof price !== "number" || typeof discount !== "number") {
    throw new Error("Les valeurs doivent être numériques");
  }

  if (price < 0 || discount < 0) {
    throw new Error("Les valeurs ne peuvent pas être négatives");
  }

  return price - (price * discount) / 100;
}
