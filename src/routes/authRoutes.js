import { Router } from 'express'
import { registerUserSchema, loginSchema } from '../schemas/authSchemas.js'
import { validateSchema } from '../middlewares/validateSchemas.js'
import { signIn, signUp } from '../controllers/authControllers.js'


const authRoutes = Router()

authRoutes.post("/sign-up", validateSchema(registerUserSchema) ,signUp)
authRoutes.post("/sign-in", validateSchema(loginSchema),signIn)

export default authRoutes