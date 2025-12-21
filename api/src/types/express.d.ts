declare namespace Express {
    export interface Request {
        user?: {
            sub: string
            restaurantId?: string
        }
    }
}
