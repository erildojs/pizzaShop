import { Router } from 'express'
import { authenticateFromLink } from './routes/authenticate-from-link.js'
import { sendAuthenticationLink } from './routes/send-authentication-link.js'
import { registerRestaurant } from './routes/register-restaurant.js'
import { registerCustomer } from './routes/register-customer.js'
import { getProfile } from './routes/get-profile.js'
import { createOrder } from './routes/create-order.js'
import { signOutRoute } from './routes/sign-out.js'

export const routes = Router()

routes.use(authenticateFromLink)
routes.use(sendAuthenticationLink)
routes.use(registerRestaurant)
routes.use(registerCustomer)
routes.use(getProfile)
routes.use(createOrder)
routes.use(signOutRoute)
