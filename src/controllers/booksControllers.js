import db from "../config/database.js";

export async function getBooks(req, res) {
  const books = await db.collection("books").find({}).toArray();
  res.status(200).send(books);
}
