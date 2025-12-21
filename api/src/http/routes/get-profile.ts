import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { authMiddleware } from '../auth.js'

export const getProfile = Router()

getProfile.get('/me', authMiddleware, async (req, res, next) => {
    try {
        const { sub: userId } = req.user!

        const user = await prisma.user.findUnique({
            where: { id: userId },
        })

        if (!user) {
            return res.status(400).send({ message: 'User not found' })
        }

        return res.send(user)
    } catch (err) {
        next(err)
    }
})
