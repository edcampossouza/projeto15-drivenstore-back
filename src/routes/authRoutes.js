import { Router } from 'express'
import { registerUserSchema, loginSchema } from '../schemas/authSchemas'


const authRouter = Router()

authRouter.post("/sign-up", validateSchema(registerUserSchema) ,signUp)
authRouter.post("/", validateSchema(loginSchema),signIn)

export default authRouter