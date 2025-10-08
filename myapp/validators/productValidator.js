// validators/productValidator.js
import Joi from "joi";

//   Pour POST (création)
export const productSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).default(0),
  tags: Joi.array().items(Joi.string()).default([])
});

//   Pour PATCH (mise à jour)
export const productUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  tags: Joi.array().items(Joi.string())
}).min(1); //  Au moins un champ requis
