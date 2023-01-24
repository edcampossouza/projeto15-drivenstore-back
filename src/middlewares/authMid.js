import { v4 as uuidV4 } from "uuid"
import db from "../config/database.js";
import bcrypt from 'bcrypt'

export async function authValidation(req, res, next) {
    const user = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(422).send("Informa o token!")
    try {
        const checkSession = await db.collection("sessions").findOne({ token })

        if (!checkSession) return res.status(401).send("Você não tem autorização")

        const checkUserExist = await db.collection("users").findOne({ email: user.email })

        if (checkUserExist) return res.status(409).send("Email já cadastrado")

        res.locals.session = checkSession

        next()
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message)
    }
}

export async function authSignUp(req, res, next) {
    const user = req.body

    try {
        const checkUserExist = await db.collection("users").findOne({email: user.email})

        if (checkUserExist) return res.status(401).send("Email já cadastrado")

        next()
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message)
        
    }
   

}

export async function authSignIn(req, res, next) {
    const user = req.body

    const token = uuidV4()

    res.locals.token = token

    try {

        const checkUserExist = await db.collection("users").findOne({ email: user.email })

        if (!checkUserExist) return res.status(404).send("Usuário ou senha incorretos")

        const matchPassword = bcrypt.compareSync(user.password, checkUserExist.password)

        if (!matchPassword) return res.status(404).send("Usuário ou senha incorretos")

        await db.collection("sessions").insertOne({ userId: checkUserExist._id, token, user: checkUserExist.name })

        next()

    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message)
    }

}