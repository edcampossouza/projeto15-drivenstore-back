import { ObjectId } from "mongodb";
import db from "../config/database.js";

export async function getBooks(req, res) {
  const { category } = req.query;
  console.log(category);
  const books = await db.collection("books").find({}).toArray();

  // ordenar por ordem de mais vendido
  if (category === "best-sellers") {
    const totals = await bookSalesTotals();
    books.sort((a, b) => {
      const totalsA = totals[a._id] || 0;
      const totalsB = totals[b._id] || 0;
      return totalsB - totalsA;
    });
    books.forEach((book) => {
      book.quantitySold = totals[book._id] || 0;
    });
  // ordenar por dt/hora de criacao (mais novos primeiro)
  } else if (category === "newest") {
    books.sort((a, b) => b.createdAt - a.createdAt);
  }
  res.status(200).send(books);
}

export async function getBookById(req, res) {
  const { id } = req.params;

  try {
    const book = await db.collection("books").findOne({ _id: ObjectId(id) });
    if (!book) return res.status(404).send("Livro não existe");
    res.send(book);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
}

// retorna um array com as vendas de cada livro
async function bookSalesTotals() {
  const orders = await db.collection("orders").find({}).toArray();
  const totals = orders.reduce((total, order) => {
    order.books.forEach((book) => {
      console.log(book);
      total[book.bookId] = (total[book.bookId] || 0) + book.quantity;
    });
    return total;
  }, {});
  return totals;
}
