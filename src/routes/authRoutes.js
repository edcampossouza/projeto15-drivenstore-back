import { Router } from 'express'
import { registerUserSchema, loginSchema } from '../schemas/authSchemas.js'
import { validateSchema } from '../middlewares/validateSchemas.js'
import { signIn, signUp } from '../controllers/authControllers.js'
import { authSignIn, authSignUp } from '../middlewares/authMid.js'


const authRoutes = Router()

authRoutes.post("/sign-up", validateSchema(registerUserSchema), authSignUp ,signUp)
authRoutes.post("/sign-in", validateSchema(loginSchema), authSignIn,signIn)

export default authRoutes