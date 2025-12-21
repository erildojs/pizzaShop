import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { createId } from '@paralleldrive/cuid2'
import { env } from '../../env.js'
import { UnauthorizedError } from './errors/unauthorized-error.js'
import { mail } from 'src/lib/mail.ts'
import nodemailer from 'nodemailer'

export const sendAuthenticationLink = Router()

sendAuthenticationLink.post('/authenticate', async (req, res, next) => {
    const bodySchema = z.object({
        email: z.string().email(),
    })

    const result = bodySchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).send({ message: 'Invalid email' })
    }

    const { email } = result.data

    try {
        const userFromEmail = await prisma.user.findUnique({
            where: { email },
        })

        if (!userFromEmail) {
            throw new UnauthorizedError()
        }

        const authLinkCode = createId()

        await prisma.authLink.create({
            data: {
                userId: userFromEmail.id,
                code: authLinkCode,
            },
        })

        const authLink = new URL('/auth-links/authenticate', env.API_BASE_URL)
        authLink.searchParams.set('code', authLinkCode)
        authLink.searchParams.set('redirect', env.AUTH_REDIRECT_URL)
        const emailSendInfo = await mail.sendMail({
            from: {
                name: "Pizza Shop",
                address: "hi@pizzashop.com"
            },
            to: email,
            subject: "Authenticate to Pizza Shop",
            text: `Use the following link to authenticate on pizza shop: ${authLink.toString()}`
        })
        console.log(nodemailer.getTestMessageUrl(emailSendInfo))

        return res.status(200).send()
    } catch (err) {
        next(err)
    }
})
