import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import booksRouter from "./routes/booksRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import salesRouter from "./routes/salesRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.json());
app.use(cors());

app.use([authRoutes, booksRouter, salesRouter]);

app.listen(PORT, console.log(`app listening on port ${PORT}`));
