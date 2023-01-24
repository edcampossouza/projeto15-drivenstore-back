import db from "../config/database";

export async function authValidation(req, res, next) {
    const user = req.body
    const { authorization } = req.headers
    const token = authorization?.replace("Bearer ", "")
    if (!token) return res.status(422).send("Informa o token!")
    try {
        const checkSession = await db.collection("sessions").findOne({ token })

        if(!checkSession) return res.status(401).send("Você não tem autorização")

        const checkUserExist = await db.collection("users").findOne({email: user.email})

        if(checkUserExist) return res.status(409).send("Email já cadastrado")

        res.locals.session = checkSession
        
        next()
    } catch (error) {
        console.log(error.message)
        return res.status(500).send(error.message)
    }
}