import joi from "joi";

const mongoObjectID = joi.string().hex().length(24);

export const cartItemSchema = joi.object({
  bookID: mongoObjectID.required(),
  quantity: joi.number().positive().required(),
});

export const addressSchema = joi.object({
  cep: joi
    .string()
    .length(8)
    .pattern(/^[0-9]+$/)
    .required(),
  line: joi.string().min(3).required(),
});

export const creditCardSchema = joi
  .string()
  .length(6)
  .pattern(/^[0-9]+$/);

export const checkoutInfo = joi.object({
  address: addressSchema.required(),
  cardNumber: creditCardSchema.required(),
  saveAddress: joi.bool(),
});
