import { app } from './app.js'
import { env } from './env.js'

app.listen(env.PORT, () => {
    console.log(`HTTP Server running on port ${env.PORT}`)
})
