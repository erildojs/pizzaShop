import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../env.js'
import { UnauthorizedError } from './routes/errors/unauthorized-error.js'
import { NotAManagerError } from './routes/errors/not-a-manager-error.js'

export interface UserPayload {
    sub: string
    restaurantId?: string
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const { auth } = req.cookies

    if (!auth) {
        return next(new UnauthorizedError())
    }

    try {
        const payload = jwt.verify(auth, env.JWT_SECRET_KEY) as UserPayload
        req.user = payload
        next()
    } catch (err) {
        return next(new UnauthorizedError())
    }
}

export function requireManager(req: Request, res: Response, next: NextFunction) {
    if (!req.user?.restaurantId) {
        return next(new NotAManagerError())
    }
    next()
}

export function signUser(res: Response, payload: UserPayload) {
    const token = jwt.sign(payload, env.JWT_SECRET_KEY, {
        expiresIn: '7d',
    })

    res.cookie('auth', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
    })
}

export function signOut(res: Response) {
    res.clearCookie('auth')
}
