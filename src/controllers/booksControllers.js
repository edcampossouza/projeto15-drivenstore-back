import { ObjectId } from "mongodb";
import db from "../config/database.js";

export async function getBooks(req, res) {
  const books = await db.collection("books").find({}).toArray();
  res.status(200).send(books);
}

export async function getBookById(req, res) {
  const { id } = req.params

  try {
    const book = await db.collection("books").findOne({ _id: ObjectId(id) })
    if (!book) return res.status(404).send("Livro não existe")
    res.send(book)
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}