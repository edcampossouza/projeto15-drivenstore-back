import { ObjectId } from "mongodb";
import db from "../config/database.js";

export async function postCartItem(req, res) {
  const { bookID, quantity } = req.body;

  try {
    const book = await db
      .collection("books")
      .findOne({ _id: ObjectId(bookID) });
    if (!book) {
      return res.status(404).send("id de livro inválido");
    }
    const { userId } = res.locals.session;

    await db.collection("cart").updateOne(
      { bookID: ObjectId(bookID), userID: ObjectId(userId) },
      {
        $set: {
          bookID: ObjectId(bookID),
          userID: ObjectId(userId),
          quantity,
        },
      },
      { upsert: true }
    );

    return res.status(201).send("Ok");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function deleteCartItem(req, res) {
  const { cartItemId } = req.params;
  const { userId } = res.locals.session;

  try {
    const result = await db
      .collection("cart")
      .deleteOne({ _id: ObjectId(cartItemId), userID: ObjectId(userId) });

    if (result.deletedCount === 1) {
      return res.status(200).send("livro removido com sucesso");
    } else return res.status(404).send("livro nao encontrado no seu carrinho");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
