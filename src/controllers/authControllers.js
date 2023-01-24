import db from "../config/database.js"
import bcrypt from "bcrypt"



export async function signUp(req, res) {
    
    const user = req.body
    const encryptPassword = bcrypt.hashSync(user.password, 10)

    try {

        await db.collection("users").insertOne({ name: user.name, email: user.email, password: encryptPassword })

        return res.status(201).send("Usuário cadastrado com sucesso")

    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

export async function signIn(req, res) {
    const token = res.locals.token
    try {
        const result = await db.collection("sessions").findOne({ token })

        return res.send({ token: result.token, name: result.user })

    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}