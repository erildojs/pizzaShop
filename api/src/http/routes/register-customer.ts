import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'

export const registerCustomer = Router()

const registerCustomerBodySchema = z.object({
  name: z.string().min(1),
  phone: z.string(),
  email: z.string().email(),
})

registerCustomer.post('/customers', async (req, res, next) => {
  const result = registerCustomerBodySchema.safeParse(req.body)
  
  if (!result.success) {
    return res.status(400).send({ message: 'Validation error' })
  }

  const { name, phone, email } = result.data

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: 'customer',
      },
    })

    return res.status(201).send()
  } catch (err) {
    next(err)
  }
})
