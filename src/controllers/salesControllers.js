import { ObjectId } from "mongodb";
import db from "../config/database.js";
import { cartItemSchema } from "../schemas/saleSchemas.js";

export async function postCartItem(req, res) {
  const { error, value } = cartItemSchema.validate(req.body, {
    abortEarly: false,
    convert: true,
  });

  if (error) {
    return res.status(422).send(error.details.map((e) => e.message));
  }

  const { bookID, quantity } = value;
  console.log(req.body);

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

    return res.status(201).send("Item adicionado no carrinho com sucesso!");
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

//observacao: a funcao abaixo nao utiliza transactions
//podem ocorrer race conditions
export async function checkout(req, res) {
  const { userId } = res.locals.session;
  const { address, cardNumber, saveAddress } = req.body;

  if (saveAddress) {
    saveUserAddress(userId, address);
  }

  try {
    const cartItems = await db
      .collection("cart")
      .find({ userID: ObjectId(userId) })
      .toArray();

    if (!cartItems || !cartItems.length) {
      return res.status(404).send("Voce nao tem nenhum livro no seu carrinho");
    }
    const toUpdateStock = [];
    const orderItems = [];
    let totalPrice = 0;
    for (const cartItem of cartItems) {
      const book = await db
        .collection("books")
        .findOne({ _id: cartItem.bookID });
      if (!book) {
        return res.status(409).send(`Livro ${cartItem.bookID} nao encontrado`);
      }
      const itemPrice = cartItem.quantity * book.price;
      cartItem.totalPrice = itemPrice;
      totalPrice += itemPrice;
      orderItems.push({
        bookId: cartItem.bookID,
        totalPrice: cartItem.totalPrice,
        quantity: cartItem.quantity,
      });
      if (book.type === "physical") {
        if (book.stock < cartItem.quantity) {
          return res
            .status(409)
            .send(
              `Fora de estoque: ${book.title}: Estoque: ${book.stock}. Qtd. requisitada: ${cartItem.quantity}`
            );
        } else {
          toUpdateStock.push(cartItem);
        }
      }
    }
    // atualiza os saldos dos livros fisicos
    for (const item of toUpdateStock) {
      db.collection("books").updateOne(
        { _id: item.bookID },
        { $inc: { stock: -item.quantity } }
      );
    }

    const order = {
      userId: ObjectId(userId),
      totalPrice,
      books: orderItems,
      datetime: Date.now(),
      address,
      cardNumber: maskCard(cardNumber),
    };

    db.collection("orders").insertOne(order);
    db.collection("cart").deleteMany({ userID: ObjectId(userId) });

    return res.status(200).send("Pedido recebido com sucesso");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getUserCart(req, res) {
  const { userId } = res.locals.session;
  try {
    const userCart = await db
      .collection("cart")
      .find({ userID: ObjectId(userId) })
      .toArray();
    // console.log(userCart);
    for (const item of userCart) {
      const book = await db.collection("books").findOne({ _id: item.bookID });
      // console.log(book)
      item.cover = book.cover;
      item.title = book.title;
      item.price = book.price;
      item.bookID = book._id;
    }
    return res.send(userCart);
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

// salva o endereco informado para as proximas compras
function saveUserAddress(userID, address) {
  try {
    db.collection("addresses").updateOne(
      { userID: ObjectId(userID) },
      {
        $set: {
          userID: ObjectId(userID),
          address,
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.log("saveAddress: ", error.message);
  }
}

// esconde os numeros do cartao
// ex.: 123456 -> 1----6
function maskCard(cardNumber) {
  if (typeof cardNumber !== "string" || cardNumber.length !== 6)
    return cardNumber;
  return cardNumber.replace(/(\d)(\d{4})(\d)/, "$1----$3");
}

// retorna o endereco salvo pelo usuario
export async function getUserAddress(req, res) {
  const { userId } = res.locals.session;
  try {
    const address = await db
      .collection("addresses")
      .findOne({ userID: ObjectId(userId) });
    if (address) return res.status(200).send(address);
    else res.status(404).send("Não encontrado");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

export async function getUserOrders(req, res) {
  const { userId } = res.locals.session;

  try {
    const orders = await db
      .collection("orders")
      .find({ userId: ObjectId(userId) })
      .toArray();
    if (orders) return res.status(200).send(orders);
    else res.status(404).send("Não encontrado");
  } catch (error) {
    return res.status(500).send(error.message);
  }
}
