import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { authMiddleware } from '../auth.js'
import { UnauthorizedError } from './errors/unauthorized-error.js'
import { NotAManagerError } from './errors/not-a-manager-error.js'

export const getOrderDetails = Router()

getOrderDetails.get(
  '/orders/:id',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { id: orderId } = z.object({ id: z.string() }).parse(req.params)
      const { restaurantId } = req.user || {}

      if (!restaurantId) {
        throw new NotAManagerError()
      }

      const order = await prisma.order.findFirst({
        select: {
          id: true,
          createdAt: true,
          status: true,
          totalInCents: true,
          customer: {
            select: {
              name: true,
              phone: true,
              email: true,
            },
          },
          orderItems: {
            select: {
              id: true,
              priceInCents: true,
              quantity: true,
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        where: {
          id: orderId,
          restaurantId,
        },
      })

      if (!order) {
        throw new UnauthorizedError()
      }

      res.json(order)
    } catch (err) {
      next(err)
    }
  },
)
