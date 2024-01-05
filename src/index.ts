import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { user } from './controller/user/user'

const app = new Elysia({ prefix: '/api' })
  .use(
    cors({
      origin: [/localhost:\d+/],
      allowedHeaders: ['Content-Type'],
    })
  )
  .use(user)
  .get('/', () => 'Home Page')

export type App = typeof app

app.listen(Bun.env.PORT || 3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
