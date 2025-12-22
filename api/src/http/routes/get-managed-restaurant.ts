import { Router } from 'express'
import { prisma } from '../../lib/prisma.js'
import { authMiddleware } from '../auth.js'

export const getManagedRestaurant = Router()

getManagedRestaurant.get('/managed-restaurant', authMiddleware, async (req, res, next) => {
    try {
        const { sub: userId } = req.user!

        const restaurant = await prisma.restaurant.findUnique({
            where: {
                managerId: userId,
            },
        })

        if (!restaurant) {
            return res.status(404).send({ message: 'Restaurant not found.' })
        }

        return res.send(restaurant)
    } catch (err) {
        next(err)
    }
})