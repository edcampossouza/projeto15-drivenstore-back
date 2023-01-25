import { Router } from "express";
import {
  deleteCartItem,
  getUserCart,
  postCartItem,
  checkout,
} from "../controllers/salesControllers.js";
import { authValidation } from "../middlewares/authMid.js";
import { validateSchema } from "../middlewares/validateSchemas.js";
import { cartItemSchema } from "../schemas/saleSchemas.js";

const salesRouter = Router();

salesRouter.post(
  "/cart",
  authValidation,
  validateSchema(cartItemSchema),
  postCartItem
);

salesRouter.delete("/cart/:cartItemId", authValidation, deleteCartItem);

salesRouter.post("/checkout", authValidation, checkout);

salesRouter.get("/cart",  authValidation,getUserCart)

export default salesRouter;