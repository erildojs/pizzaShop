import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma.js'
import { Prisma } from '@prisma/generated/client.ts'
import { NotAManagerError } from './errors/not-a-manager-error.js'
import { authMiddleware } from '../auth.js'

export const getOrders = Router()

const getOrdersQuerySchema = z.object({
  pageIndex: z.coerce.number().min(0).default(0),
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.enum(['pending', 'processing', 'delivering', 'delivered', 'canceled']).optional(),
})

getOrders.get('/orders', authMiddleware, async (req, res, next) => {
  try {
    const { pageIndex, orderId, customerName, status } = getOrdersQuerySchema.parse(req.query)
    const { restaurantId } = req.user || {}

    if (!restaurantId) {
      throw new NotAManagerError()
    }

    const conditions: Prisma.Sql[] = [
      Prisma.sql`o.restaurant_id = ${restaurantId}`
    ]

    if (orderId) {
      conditions.push(Prisma.sql`o.id ILIKE ${`%${orderId}%`}`)
    }

    if (status) {
      conditions.push(Prisma.sql`o.status = ${status}::"OrderStatus"`)
    }

    if (customerName) {
      conditions.push(Prisma.sql`u.name ILIKE ${`%${customerName}%`}`)
    }

    const whereClause = conditions.length
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`
      : Prisma.sql``

    const ordersCount = await prisma.$queryRaw<[{ count: bigint }]>`
      SELECT count(o.id) 
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ${whereClause}
    `

    const allOrders = await prisma.$queryRaw<
      Array<{
        orderId: string
        createdAt: Date
        status: 'pending' | 'processing' | 'delivering' | 'delivered' | 'canceled'
        customerName: string
        total: number
      }>
    >`
      SELECT 
        o.id as "orderId", 
        o.created_at as "createdAt", 
        o.status, 
        u.name as "customerName", 
        o.total_in_cents as "total"
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      ${whereClause}
      ORDER BY 
        CASE o.status 
          WHEN 'pending' THEN 1
          WHEN 'processing' THEN 2
          WHEN 'delivering' THEN 3
          WHEN 'delivered' THEN 4
          WHEN 'canceled' THEN 99
        END,
        o.created_at DESC
      OFFSET ${pageIndex * 10}
      LIMIT 10
    `

    const result = {
      orders: allOrders,
      meta: {
        pageIndex,
        perPage: 10,
        totalCount: Number(ordersCount[0]?.count || 0),
      },
    }

    res.json(result)
  } catch (err) {
    next(err)
  }
})
