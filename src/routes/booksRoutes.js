import { Router } from "express";
import { getBookById, getBooks } from "../controllers/booksControllers.js";
import { authValidation } from "../middlewares/authMid.js";

const bookRouter = Router();


bookRouter.get("/books", getBooks);
bookRouter.get("/books/?:id", getBookById);

export default bookRouter;
