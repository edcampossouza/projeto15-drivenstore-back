import { Router } from "express";
import {
  deleteCartItem,
  getUserCart,
  postCartItem,
  checkout,
  getUserAddress
} from "../controllers/salesControllers.js";
import { authValidation } from "../middlewares/authMid.js";
import { checkoutInfo } from "../schemas/saleSchemas.js";
import { validateSchema } from "../middlewares/validateSchemas.js";

const salesRouter = Router();

salesRouter.post("/cart", authValidation, postCartItem);

salesRouter.delete("/cart/:cartItemId", authValidation, deleteCartItem);

salesRouter.post(
  "/checkout",
  authValidation,
  validateSchema(checkoutInfo),
  checkout
);

salesRouter.get("/cart", authValidation, getUserCart);

salesRouter.get("/address", authValidation, getUserAddress);

export default salesRouter;
