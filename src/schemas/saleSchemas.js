import joi from "joi";

const mongoObjectID = joi.string().hex().length(24);

export const cartItemSchema = joi.object({
  bookID: mongoObjectID.required(),
  quantity: joi.number().positive().required(),
});
