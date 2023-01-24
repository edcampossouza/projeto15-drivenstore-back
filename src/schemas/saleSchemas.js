import joi from "joi";

const mongoObjectID = joi.string().hex().length(24);

export const registerSaleItemSchema = joi.object({
  bookID: mongoObjectID.required(),
  quantity: joi.number().positive().required(),
});

export const registerSaleSchema = joi.object({
  userID: mongoObjectID.required(),
  items: joi.array().items(registerSaleItemSchema).min(1).required(),
});
