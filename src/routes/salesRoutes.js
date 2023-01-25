import { Router } from "express";
import {
  deleteCartItem,
  getUserCart,
  postCartItem,
  checkout,
} from "../controllers/salesControllers.js";
import { authValidation } from "../middlewares/authMid.js";

const salesRouter = Router();

salesRouter.post(
  "/cart",
  authValidation,
  postCartItem
);

salesRouter.delete("/cart/:cartItemId", authValidation, deleteCartItem);

salesRouter.post("/checkout", authValidation, checkout);

salesRouter.get("/cart",  authValidation,getUserCart)

export default salesRouter;
