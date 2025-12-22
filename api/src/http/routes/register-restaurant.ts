import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export const registerRestaurant = Router()

registerRestaurant.post('/restaurants', async (req, res, next) => {
    const bodySchema = z.object({
        restaurantName: z.string(),
        managerName: z.string(),
        phone: z.string(),
        email: z.string().email(),
    })

    const result = bodySchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send({ message: 'Validation error' })
    }

    const { restaurantName, managerName, email, phone } = result.data

    try {
        await prisma.$transaction(async (tx) => {
            const manager = await tx.user.create({
                data: {
                    name: managerName,
                    email,
                    phone,
                    role: 'manager',
                },
            })

            await tx.restaurant.create({
                data: {
                    name: restaurantName,
                    managerId: manager.id,
                },
            })
        }, {
            maxWait: 5000,
            timeout: 10000,
        })

        return res.status(204).send()
    } catch (err) {
        next(err)
    }
})
