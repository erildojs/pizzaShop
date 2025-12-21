import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { UnauthorizedError } from './errors/unauthorized-error.js'
import dayjs from 'dayjs'
import { signUser } from '../auth.js'

export const authenticateFromLink = Router()

authenticateFromLink.get('/auth-links/authenticate', async (req, res, next) => {
    const querySchema = z.object({
        code: z.string(),
        redirect: z.string(),
    })

    const result = querySchema.safeParse(req.query)
    if (!result.success) {
        return res.status(400).send({ message: 'Invalid query params' })
    }

    const { code, redirect } = result.data

    try {
        const authLinkFromCode = await prisma.authLink.findUnique({
            where: { code },
        })

        if (!authLinkFromCode) {
            throw new UnauthorizedError()
        }

        if (dayjs().diff(authLinkFromCode.createdAt, 'days') > 7) {
            throw new UnauthorizedError()
        }

        const managedRestaurant = await prisma.restaurant.findUnique({
            where: { managerId: authLinkFromCode.userId },
        })

        signUser(res, {
            sub: authLinkFromCode.userId,
            restaurantId: managedRestaurant?.id,
        })

        await prisma.authLink.delete({
            where: { code },
        })

        return res.redirect(redirect)
    } catch (err) {
        next(err)
    }
})
