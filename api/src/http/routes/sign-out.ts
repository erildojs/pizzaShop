import { Router } from 'express'
import { signOut } from '../auth.js'
import { authMiddleware } from '../auth.js'

export const signOutRoute = Router()

signOutRoute.post('/sign-out', authMiddleware, async (req, res) => {
    signOut(res)
    return res.send()
})
