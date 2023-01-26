import joi from "joi";

export const registerBookSchema = joi.object({
  title: joi.string().required(),
  author: joi.string().required(),
  synopsis: joi.string().required(),
  cover: joi.string().uri().required(),
  price: joi.number().precision(2).required(),
  type: joi.valid("digital", "physical").required(),
  // link de download: apenas quando o livro for digital
  downloadLink: joi.alternatives().conditional("type", {
    is: "digital",
    then: joi.string().uri().required(),
  }),
  // estoque: apenas quando o livro for fisicoa
  stock: joi.alternatives().conditional("type", {
    is: "physical",
    then: joi.number().positive().allow(0).required(),
  }),
  createdAt: joi.number().required(),
});
