import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ZodError } from 'zod'
import { env } from './env.js'
import { routes } from './http/routes.js'
import { UnauthorizedError } from './http/routes/errors/unauthorized-error.js'
import { NotAManagerError } from './http/routes/errors/not-a-manager-error.js'

export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: env.API_BASE_URL,
    credentials: true,
}))

app.use(routes)

app.get('/health', (req, res) => {
    res.send('OK')
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ZodError) {
        return res.status(400).send({ message: 'Validation error', issues: err.format() })
    }

    if (err instanceof UnauthorizedError) {
        return res.status(401).send({ message: err.message })
    }

    if (err instanceof NotAManagerError) {
        return res.status(401).send({ message: err.message })
    }

    console.error(err)

    res.status(500).send({ message: 'Internal server error' })
})
