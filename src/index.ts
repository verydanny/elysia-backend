import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { user } from './controller/user'

const app = new Elysia({ prefix: '/api' })
  .use(
    cors({
      origin: [/localhost:\d+/],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(user)
  .get('/', () => 'Home Page')
  .listen(Bun.env.PORT || 3000)

export type App = typeof app

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
