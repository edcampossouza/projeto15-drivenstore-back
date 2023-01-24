import db from "../config/database.js"
import bcrypt from "bcrypt"
import { v4 as uuidV4 } from "uuid"

export async function signUp(req, res) {
    const  user  = req.body
    const encryptPassword = bcrypt.hashSync(user.password, 10)
    console.log(user)
    try {
        const checkUserExist = await db.collection("users").findOne({email: user.email})

        if (checkUserExist) return res.status(401).send("Email já cadastrado")

        await db.collection("users").insertOne({ name: user.name, email: user.email, password: encryptPassword })

        return res.status(201).send("Usuário cadastrado com sucesso")

    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}

export async function signIn(req, res) {
    const user = req.body
    const token = uuidV4()
    try {
        const checkUserExist = await db.collection("users").findOne({email: user.email})

        if(!checkUserExist) return res.status(404).send("Usuário ou senha incorretos")

        const matchPassword = bcrypt.compareSync(user.password, checkUserExist.password)

        if(!matchPassword) return  res.status(404).send("Usuário ou senha incorretos")

        await db.collection("sessions").insertOne({userId: checkUserExist._id, token, user: checkUserExist.name})

        const result = await db.collection("sessions").findOne({token})
        console.log(result)

        return res.send({token: result.token, name: result.user})
        
        
    } catch (error) {
        console.log(error)
        return res.status(500).send(error.message)
    }
}