import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { authMiddleware } from '../auth.js'

export const createOrder = Router()

createOrder.post('/restaurants/:restaurantId/orders', authMiddleware, async (req, res, next) => {
    const paramsSchema = z.object({
        restaurantId: z.string(),
    })

    const bodySchema = z.object({
        items: z.array(
            z.object({
                productId: z.string(),
                quantity: z.number().int().positive(),
            }),
        ),
    })

    const paramsResult = paramsSchema.safeParse(req.params)
    if (!paramsResult.success) {
        return res.status(400).send({ message: 'Invalid params' })
    }
    const { restaurantId } = paramsResult.data

    const bodyResult = bodySchema.safeParse(req.body)
    if (!bodyResult.success) {
        return res.status(400).send({ message: 'Invalid body' })
    }
    const { items } = bodyResult.data
    const { sub: customerId } = req.user!

    try {
        const productsIds = items.map((item) => item.productId)

        const products = await prisma.product.findMany({
            where: {
                restaurantId,
                id: { in: productsIds },
            },
        })

        const orderProducts = items.map((item) => {
            const product = products.find((product) => product.id === item.productId)

            if (!product) {
                throw new Error('Not all products are available in this restaurant.')
            }

            return {
                productId: item.productId,
                unitPriceInCents: product.priceInCents,
                quantity: item.quantity,
                subtotalInCents: item.quantity * product.priceInCents,
            }
        })

        const totalInCents = orderProducts.reduce((total, orderItem) => {
            return total + orderItem.subtotalInCents
        }, 0)

        await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    totalInCents,
                    customerId,
                    restaurantId,
                },
            })

            await tx.orderItem.createMany({
                data: orderProducts.map((orderProduct) => {
                    return {
                        orderId: order.id,
                        productId: orderProduct.productId,
                        priceInCents: orderProduct.unitPriceInCents,
                        quantity: orderProduct.quantity,
                    }
                }),
            })
        })

        return res.status(201).send()
    } catch (err) {
        if (err instanceof Error && err.message === 'Not all products are available in this restaurant.') {
            return res.status(400).send({ message: err.message })
        }
        next(err)
    }
})
