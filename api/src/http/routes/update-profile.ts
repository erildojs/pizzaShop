import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { authMiddleware } from '../auth.js'

export const updateProfile = Router()

updateProfile.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string().nullable(),
    })

    const { name, description } = bodySchema.parse(req.body)

    const { sub: userId } = req.user!

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        managerId: userId,
      },
    })

    if (!restaurant) {
      return res.status(404).send({ message: 'Restaurant not found.' })
    }

    await prisma.restaurant.update({
      where: {
        managerId: userId,
      },
      data: {
        name,
        description,
      },
    })

    return res.status(204).send()
  } catch (err) {
    next(err)
  }
})