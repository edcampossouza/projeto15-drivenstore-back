import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3500;
const app = express();

app.use(express.json());
app.use(cors());

app.listen(PORT, console.log(`app listening on port ${PORT}`));
